import React from 'react';
import MyPage from '../screens/MyPage';
import { useNavigation } from '@react-navigation/native';

const MyPageScreen = () => {
  const navigation = useNavigation();

  return (
    <MyPage onBackClick={() => navigation.goBack()} />
  );
};

export default MyPageScreen; 