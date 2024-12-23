import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { stages } from '../app/types/stages';

const resultStage = { id: 'result', name: '結果画面' };

export default function HomeScreen() {
  const router = useRouter();

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
            style={styles.stageItem}
            onPress={() => router.push(`/jankengame?stageId=${stage.id}`)}
          >
            <Text style={styles.stageText}>{stage.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key={resultStage.id}
          style={styles.stageItem}
          onPress={() => router.push(`/jankengame?stageId=${resultStage.id}`)}
        >
          <Text style={styles.stageText}>{resultStage.name}</Text>
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
});
