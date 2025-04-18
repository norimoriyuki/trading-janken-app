import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStageUnlock = () => {
  const [unlockedStages, setUnlockedStages] = useState<Record<number, boolean>>({
    1: true // ステージ1は常に開放
  });

  // ステージ開放状態を読み込む
  const loadUnlockedStages = async () => {
    try {
      const saved = await AsyncStorage.getItem('unlockedStages');
      if (saved) {
        const savedStages = JSON.parse(saved);
        setUnlockedStages({ ...savedStages, 1: true }); // ステージ1は必ず開放
      }
    } catch (error) {
      console.error('Failed to load unlocked stages:', error);
    }
  };

  // 新しいステージを開放
  const unlockStage = async (stageId: number) => {
    const newUnlockedStages = { ...unlockedStages, [stageId]: true };
    setUnlockedStages(newUnlockedStages);
    try {
      await AsyncStorage.setItem('unlockedStages', JSON.stringify(newUnlockedStages));
    } catch (error) {
      console.error('Failed to save unlocked stages:', error);
    }
  };

  // 初回マウント時に読み込み
  useEffect(() => {
    loadUnlockedStages();
  }, []);

  return {
    isStageUnlocked: (stageId: number) => unlockedStages[stageId] || false,
    unlockStage,
    loadUnlockedStages,
  };
}; 