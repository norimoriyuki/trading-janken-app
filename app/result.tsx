import React from "react";
import ResultScreen from "../screens/Result";
import { Provider } from "react-redux";
import store from "./stores";

const Result = () => {
  return (
    <Provider store={store}>
      <ResultScreen />
    </Provider>
  );
};

export default Result;
