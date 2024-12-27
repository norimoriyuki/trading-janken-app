import React, { useState } from 'react';
import JankenGameScreen from '../screens/JankenGame';
import { Provider } from "react-redux";
import store from "./stores";
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, LayoutRectangle } from 'react-native';

const JankenGame = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { stageId } = (route.params as { stageId: string });
  const [cardPositions, setCardPositions] = useState<LayoutRectangle[]>([]);

  const handleCardLayout = (index: number, layout: LayoutRectangle) => {
    setCardPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = layout;
      return newPositions;
    });
  };

  return (
    <Provider store={store}>
      <JankenGameScreen 
        onBackClick={() => navigation.goBack()} 
        playerChoices={[]} 
        stageId={stageId}
        onCardLayout={handleCardLayout}
        cardPositions={cardPositions}
      />
    </Provider>
  );
};

export default JankenGame;
