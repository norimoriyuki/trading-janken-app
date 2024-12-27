import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import JankenCard from './JankenCard';
import { ChoiceType } from '@/app/types/models';

interface ResultWindowProps {
  showResult: {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
    playerIndex: number;
    computerIndex: number;
  } | null;
  drawCount: number;
  closeResult: () => void;
  startPosition?: { x: number; y: number };
  onAnimationComplete?: () => void;
}

const ResultWindow: React.FC<ResultWindowProps> = ({
  showResult,
  drawCount,
  startPosition,
  closeResult,
  onAnimationComplete,
}) => {
  const playerCardAnim = useRef(new Animated.ValueXY({ 
    x: startPosition?.x ?? 0, 
    y: startPosition?.y ?? 0 
  })).current;
  const computerCardAnim = useRef(new Animated.ValueXY({ x: 0, y: -200 })).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // カード間の距離を計算（カードセクションの幅とマージンから概算）
  const cardDistance = 200; // カード2枚の中心間の距離（ピクセル）

  useEffect(() => {
    if (showResult) {
      // アニメーション開始時の位置を設定
      playerCardAnim.setValue({ 
        x: startPosition?.x ?? 0, 
        y: startPosition?.y ?? 0 
      });
      computerCardAnim.setValue({ x: 0, y: -200 });
      opacityAnim.setValue(0);

      // アニメーション終了位置を(0,0)に設定
      Animated.parallel([
        Animated.timing(playerCardAnim, {
          toValue: { x: 0, y: 0 },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(computerCardAnim, {
          toValue: { x: 0, y: 0 },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showResult, startPosition]);

  const handlePress = () => {
    if (!showResult) return;

    const originalPlayerPosition = {
      x: startPosition?.x ?? 0,
      y: startPosition?.y ?? 0
    };

    // カードを交換するアニメーション
    Animated.parallel([
      /*Animated.timing(playerCardAnim, {
        toValue: { 
          x: -originalPlayerPosition.x - cardDistance,  
          y: -originalPlayerPosition.y 
        },
        duration: 500,
        useNativeDriver: true,
      }),*/ //originalの座標をコンピュータのが取ってないのでとるようにする
      Animated.timing(computerCardAnim, {
        toValue: { 
          x: originalPlayerPosition.x + cardDistance,  
          y: originalPlayerPosition.y 
        },
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
      closeResult();
    });
  };

  if (!showResult) return null;

  return (
    <Pressable 
      style={styles.resultContainer}
      onPress={handlePress}  // Viewを押したときにアニメーションを開始
    >
      <View style={styles.horizontalLayout}>
        <Animated.View 
          style={[
            styles.cardSection,
            {
              transform: computerCardAnim.getTranslateTransform(),
              opacity: opacityAnim,
            }
          ]}
        >
          <JankenCard
            choice={showResult.computerChoice}
            onSwipeUp={() => {}}
            onCardPress={() => {}}
            showResult={null}
          />
        </Animated.View>

        <View style={styles.resultSection}>
          <Text style={styles.resultText}>
            {showResult.result === 'win'
              ? 'WIN'
              : showResult.result === 'lose'
              ? 'LOSE'
              : `あいこ${drawCount > 0 ? `（${drawCount}/3）` : '3/3'}`}
          </Text>
          <View style={styles.resultIcon}>
            {((showResult.result === 'win') ||
              (showResult.result === 'reset')) && (
              <View style={styles.iconContainer}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.plusMinus}>+1</Text>
              </View>
            )}
            {showResult.result === 'lose' && (
              <View style={styles.iconContainer}>
                <Text style={styles.heartIcon}>❤</Text>
                <Text style={styles.plusMinus}>-1</Text>
              </View>
            )}
          </View>
        </View>

        <Animated.View 
          style={[
            styles.cardSection,
            {
              transform: playerCardAnim.getTranslateTransform(),
              opacity: opacityAnim,
            }
          ]}
        >
          <JankenCard
            choice={showResult.playerChoice}
            onSwipeUp={() => {}}
            onCardPress={() => {}}
            showResult={null}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '100%',
  },
  cardSection: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSection: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  resultIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 24,
    color: 'gold',
  },
  heartIcon: {
    fontSize: 24,
    color: 'red',
  },
  plusMinus: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ResultWindow;