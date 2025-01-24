import React from 'react';
import JankenGameScreen from '../screens/JankenGame';
import { Provider } from "react-redux";
import store from "./stores";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

const JankenGame = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { stageId } = (route.params as { stageId: string });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Provider store={store}>
      <JankenGameScreen onBackClick={() => navigation.goBack()} stageId={stageId} />
    </Provider>
  );
};

export default JankenGame;
