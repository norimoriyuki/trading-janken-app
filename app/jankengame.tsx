import React from 'react';
import JankenGameScreen from '../screens/JankenGame';
import { Provider } from "react-redux";
import store from "./stores";

const JankenGame = () => {
  return (
    <Provider store={store}>
      <JankenGameScreen onBackClick={() => {}} playerChoices={[]} />
    </Provider>
  );
};

export default JankenGame;
