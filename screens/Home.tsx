import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { stages } from '../app/types/stages';
import { useStageUnlock } from '../app/hooks/useStageUnlock';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const resultStage = { id: 'result', name: '結果画面' };

export default function HomeScreen() {
  const router = useRouter();
  const { isStageUnlocked, loadUnlockedStages } = useStageUnlock();

  // 画面がフォーカスされるたびにステージ開放状態を再読み込み
  useFocusEffect(
    useCallback(() => {
      loadUnlockedStages();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trading Janken</Text>
      </View>

      {/* Stage List */}
      <ScrollView style={styles.stageList}>
        {stages.map(stage => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.stageItem,
              !isStageUnlocked(stage.id) && styles.lockedStage
            ]}
            onPress={() => router.push(`/jankengame?stageId=${stage.id}`)}
            disabled={!isStageUnlocked(stage.id)}
          >
            <Text style={[
              styles.stageText,
              !isStageUnlocked(stage.id) && styles.lockedStageText
            ]}>
              {stage.name}
              {!isStageUnlocked(stage.id) && ` (${stage.requiredWins}勝で開放)`}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key={resultStage.id}
          style={styles.stageItem}
          onPress={() => router.push(`/jankengame?stageId=${resultStage.id}`)}
        >
          <Text style={styles.stageText}>{resultStage.name}</Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={[styles.stageItem, styles.profileButton]}
          onPress={() => router.push('/mypage')}
        >
          <Text style={styles.stageText}>プロフィール</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stageList: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  stageItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stageText: {
    fontSize: 18,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#eeeeee',
  },
  footerItem: {
    fontSize: 18,
  },
  profileButton: {
    marginTop: 20,  // ステージリストとの間隔
    backgroundColor: '#4CAF50',  // 異なる色で区別
  },
  lockedStage: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  lockedStageText: {
    color: '#666666',
  },
});
