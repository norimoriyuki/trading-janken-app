import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


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
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/jankengame')}>
            <Text style={styles.stageText}>Stage 6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stageItem} onPress={() => router.push('/result')}>
            <Text style={styles.stageText}>結果画面</Text>
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
