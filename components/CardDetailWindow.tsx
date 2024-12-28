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
      <View style={styles.detailWindow}>
        <Text style={styles.name}>{choice.name}</Text>
        <Image
          source={choice.img}
          style={styles.image}
        />
        <Text style={styles.description}>{choice.description}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  detailWindow: {
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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