import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { ChoiceType } from '@/app/types/models';

interface CardDetailWindowProps {
  choice: ChoiceType;
  onClose: () => void;
}

const CardDetailWindow: React.FC<CardDetailWindowProps> = ({ choice, onClose }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.detailWindow}>
          <Text style={styles.name}>{choice.name}</Text>
          <Image
            source={choice.img}
            style={styles.image}
          />
          <Text style={styles.description}>{choice.description}</Text>
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
  detailWindow: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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
  },
});

export default CardDetailWindow;