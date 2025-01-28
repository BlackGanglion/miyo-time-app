import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { ProgressBar } from '@/components/ProgressBar';
const goals = [
  { id: '1', title: 'Ted 100 场', progress: 67, total: 100 },
  { id: '2', title: '减肥 6 斤', progress: 3, total: 6 },
  { id: '3', title: '骑行 1000 km', progress: 960, total: 1000 },
  { id: '4', title: '攒 2w 旅行基金', progress: 15000, total: 20000 },
  { id: '5', title: '考出初级会计证', progress: 0, total: 1 },
  { id: '6', title: '旅游计划', progress: 0, total: 4 },
];

const GoalItem = ({ title, progress, total }: { title: string; progress: number; total: number }) => (
  <View style={styles.goalItem}>
    <Text style={styles.title}>{title}</Text>
    <Text>{`${progress}/${total}`}</Text>
    <ProgressBar progress={progress / total * 100} color="#6200ee" />
    <Button title="剩余 31d" onPress={() => {}} />
  </View>
);

export default function GoalList() {
  const handleAddGoal = () => {
    // 添加目标的逻辑
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>目标列表</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.addButtonText}>+ 创建目标</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        renderItem={({ item }) => <GoalItem {...item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  goalItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
});
