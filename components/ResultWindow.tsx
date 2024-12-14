import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import JankenCard from './JankenCard';
import { ChoiceType } from './choices';

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
    <TouchableWithoutFeedback onPress={closeResult}>
      <View style={styles.overlay}>
        <View style={styles.resultWindow}>
          <View style={styles.resultContainer}>
            {/* Computer's choice */}
            <View style={styles.choice}>
              <JankenCard
                choice={showResult.computerChoice}
                onClick={() => {}}
                onRightClick={() => {}}
              />
            </View>
          </View>

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

          <View style={styles.choice}>
            <JankenCard
              choice={showResult.playerChoice}
              onClick={() => {}}
              onRightClick={() => {}}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultWindow: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  choice: {
    marginVertical: 10,
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