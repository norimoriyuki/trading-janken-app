import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyPageProps {
  onBackClick: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ onBackClick }) => {
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadName();
  }, []);

  const loadName = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName) {
        setName(savedName);
      }
    } catch (error) {
      console.error('Failed to load name:', error);
    }
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save name:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBackClick} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.title}>マイページ</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <Text style={styles.label}>名前</Text>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="名前を入力"
                />
                <Pressable style={styles.saveButton} onPress={saveName}>
                  <Text style={styles.saveButtonText}>保存</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.nameDisplay} onPress={() => setIsEditing(true)}>
                <Text style={styles.nameText}>{name || '名前を設定'}</Text>
                <Text style={styles.editText}>編集</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  nameContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  nameDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  nameText: {
    fontSize: 16,
  },
  editText: {
    color: '#666',
    fontSize: 14,
  },
});

export default MyPage; 