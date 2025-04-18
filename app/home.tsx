// File: /Users/shunki.tada/Swift/trading-janken-app/screens/result.tsx

import React from 'react';
import HomeScreen from '../screens/Home';
import { useRouter } from 'expo-router';

const Home = () => {
    const router = useRouter();
    return <HomeScreen onMyPagePress={() => router.push('/mypage')} />;
};

export default Home;
