import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from '@/components/ProgressBar';

const goals = [
  { id: '1', title: 'Ted 100 场', progress: 67, total: 100, subGoals: ['观看 10 场', '总结 5 场'] },
  { id: '2', title: '减肥 6 斤', progress: 3, total: 6, subGoals: ['跑步 5 公里', '控制饮食'] },
  { id: '3', title: '骑行 1000 km', progress: 960, total: 1000, subGoals: ['骑行 100 公里'] },
  { id: '4', title: '攒 2w 旅行基金', progress: 15000, total: 20000, subGoals: ['存 5000 元'] },
  { id: '5', title: '考出初级会计证', progress: 0, total: 1, subGoals: ['完成课程'] },
  { id: '6', title: '旅游计划', progress: 0, total: 4, subGoals: ['制定行程'] },
];

const GoalItem = ({ title, progress, total, subGoals }: { title: string; progress: number; total: number; subGoals: string[] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.goalItem}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.remainingButton} onPress={() => {}}>
          <Text style={styles.remainingButtonText}>剩余 31d</Text>
        </TouchableOpacity>
      </View>
      <ProgressBar progress={progress / total * 100} color="#3b82f6" />
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.expandButtonText}>{expanded ? '收起' : '展开'}</Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={subGoals}
          renderItem={({ item }) => <Text style={styles.subGoalText}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default function GoalList() {
  const router = useRouter();

  const handleAddGoal = () => {
    router.push('/createGoal');
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  remainingButtonText: {
    color: '#000',
    fontSize: 14,
  },
  subGoalText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
    paddingLeft: 10,
  },
  expandButtonText: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 8,
  },
});
