import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import JankenCard from './JankenCard';
import { ChoiceType } from '@/app/types/models';

interface ResultWindowProps {
  showResult: {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null;
  drawCount: number;
  closeResult: () => void;
}

const ResultWindow: React.FC<ResultWindowProps> = ({
  showResult,
  drawCount,
  closeResult,
}) => {
  const playerCardAnim = useRef(new Animated.ValueXY({ x: 0, y: 200 })).current;
  const computerCardAnim = useRef(new Animated.ValueXY({ x: 0, y: -200 })).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showResult) {
      // アニメーションの初期値をリセット
      playerCardAnim.setValue({ x: 0, y: 200 });
      computerCardAnim.setValue({ x: 0, y: -200 });
      opacityAnim.setValue(0);

      // カードの移動アニメーションと透明度のアニメーションを同時に実行
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
  }, [showResult]);

  if (!showResult) return null;

  return (
    <View style={styles.resultContainer}>
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
    </View>
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