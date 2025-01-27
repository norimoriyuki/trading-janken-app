import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ChoiceType } from '@/app/types/models';

interface CardDetailWindowProps {
  choice: ChoiceType;
  onClose: () => void;
  onPlay: () => void;
  isPlayerCard?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CardDetailWindow: React.FC<CardDetailWindowProps> = ({ choice, onClose, onPlay, isPlayerCard, style }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={[styles.detailWindow, style]}>
        <Text style={styles.name}>{choice.name}</Text>
        <Image
          source={choice.img}
          style={styles.image}
        />
        <Text style={styles.description}>{choice.description}</Text>
        
        <View style={styles.buttonContainer}>
        {isPlayerCard && (
            <Pressable style={styles.playButton} onPress={onPlay}>
              <Text style={styles.playButtonText}>プレイ</Text>
            </Pressable>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Image 
              source={require("@/assets/closeButtonBlack.png")} 
              style={styles.closeIcon} 
            />
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  detailWindow: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  playerDetailWindow: {
    height: '100%',
  },
  enemyDetailWindow: {
    height: '50%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  playButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardDetailWindow;