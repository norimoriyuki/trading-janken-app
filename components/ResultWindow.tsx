import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
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
  if (!showResult) return null;

  return (
    <View style={styles.resultContainer}>
      <View style={styles.horizontalLayout}>
        <View style={styles.cardSection}>
          <JankenCard
            choice={showResult.computerChoice}
            onSwipeUp={() => {}}
            onCardPress={() => {}}
            showResult={null}
          />
        </View>

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

        <View style={styles.cardSection}>
          <JankenCard
            choice={showResult.playerChoice}
            onSwipeUp={() => {}}
            onCardPress={() => {}}
            showResult={null}
          />
        </View>
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