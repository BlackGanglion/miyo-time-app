import React, { useState, useEffect } from 'react';
import { Modal as AntdModal, Toast as AntdToast, Provider } from '@ant-design/react-native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from '@/components/ProgressBar';
import { fetchData } from '@/api/http';
import { SwipeListView } from 'react-native-swipe-list-view';
import { KeyResult } from './type';

interface Goal {
  id: string;
  goalName: string;
  progress: number;
  total: number;
  keyResults: Array<KeyResult>;
  startTime: string;
  endTime: string;
}

const GoalItem = ({ goalName, progress, total, keyResults, startTime, endTime }: Goal) => {
  const [expanded, setExpanded] = useState(false);

  const calculateRemainingDays = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `还有 ${daysUntilStart} 天开始`;
    } else if (now >= start && now <= end) {
      const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `剩余 ${daysRemaining} 天`;
    } else {
      const daysPastEnd = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
      return `已结束 ${daysPastEnd} 天`;
    }
  };

  return (
    <View style={styles.goalItem}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{goalName}</Text>
        <TouchableOpacity style={styles.remainingButton} onPress={() => { }}>
          <Text style={styles.remainingButtonText}>{calculateRemainingDays()}</Text>
        </TouchableOpacity>
      </View>
      {/* <ProgressBar progress={progress / total * 100} color="#3b82f6" /> */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.expandButtonText}>{expanded ? '收起' : '展开'}</Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={keyResults.map(keyResult => keyResult.resultName)}
          renderItem={({ item }) => <Text style={styles.subGoalText}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default function GoalList() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await fetchData('/goals', 'GET');
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const handleAddGoal = () => {
    router.push('/(tabs)/(goal)/create');
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await fetchData(`/goals/${goalId}`, 'DELETE');
      AntdToast.success('目标已删除', 1);
      fetchGoals(); // 刷新目标列表
    } catch (error) {
      AntdToast.fail('删除目标失败，请重试', 1);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>目标列表</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.addButtonText}>+ 创建目标</Text>
          </TouchableOpacity>
        </View>
        <SwipeListView
          data={goals}
          renderItem={({ item }) => <GoalItem {...item} />}
          keyExtractor={item => item.id}
          renderHiddenItem={({ item }) => (
            <>
              <TouchableOpacity style={styles.editButton} onPress={() => {
                router.push(`/(tabs)/(goal)/edit?goalId=${item.id}`);
              }}>
                <Text style={styles.editButtonText}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => {
                AntdModal.alert(
                  '确认删除',
                  '你确定要删除这个目标吗？',
                  [
                    { text: '取消', style: 'cancel' },
                    { text: '确认', onPress: () => handleDeleteGoal(item.id) },
                  ]
                );
              }}>
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            </>
          )}
          rightOpenValue={-150}
        />
      </View>
    </Provider>
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
  dateText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 75,
    width: 75,
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    width: 75,
    height: '100%',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
