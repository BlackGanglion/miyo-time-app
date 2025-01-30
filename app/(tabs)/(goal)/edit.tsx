import React, { useState, useEffect } from 'react';
import { Provider, List, InputItem, DatePicker, Button, Toast, Icon } from '@ant-design/react-native';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { fetchData } from '@/api/http';
import { KeyResult } from './type';

export default function EditGoal() {
  const router = useRouter();
  const { goalId } = useGlobalSearchParams();
  const [goalName, setGoalName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [keyResults, setKeyResults] = useState<Array<KeyResult>>([]);

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const data = await fetchData(`/goals/${goalId}`, 'GET');
        setGoalName(data.goalName);
        setStartTime(new Date(data.startTime));
        setEndTime(new Date(data.endTime));
        setKeyResults(data.keyResults || []);
      } catch (error) {
        console.error('Failed to fetch goal details:', error);
      }
    };

    if (goalId) {
      fetchGoalDetails();
    }
  }, [goalId]);

  const handleAddKeyResult = () => {
    setKeyResults([...keyResults, { resultName: '' } as KeyResult]);
  };

  const handleKeyResultChange = (text: string, index: number) => {
    const newKeyResults = [...keyResults];
    newKeyResults[index].resultName = text;
    setKeyResults(newKeyResults);
  };

  const handleDeleteKeyResult = (index: number) => {
    const newKeyResults = keyResults.filter((_, i) => i !== index);
    setKeyResults(newKeyResults);
  };

  const handleUpdateGoal = async () => {
    try {
      await fetchData(`/goals/${goalId}`, 'PUT', {
        goalName,
        startTime,
        endTime,
        keyResults,
      });
      Toast.success('目标已更新', 1);
      router.push('/(tabs)/(goal)'); // 返回目标列表页
    } catch (error) {
      Toast.fail('更新目标失败，请重试', 1);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <List>
          <InputItem
            clear
            value={goalName}
            onChange={setGoalName}
            placeholder="目标名称"
          >
            目标名称
          </InputItem>
          <DatePicker
            value={startTime}
            mode="date"
            onChange={setStartTime}
            format="YYYY-MM-DD"
          >
            <List.Item arrow="horizontal">开始日期</List.Item>
          </DatePicker>
          <DatePicker
            value={endTime}
            mode="date"
            onChange={setEndTime}
            format="YYYY-MM-DD"
          >
            <List.Item arrow="horizontal">结束日期</List.Item>
          </DatePicker>
          <>
            {keyResults.map((keyResult, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <InputItem
                  clear
                  value={keyResult.resultName}
                  onChange={(text) => handleKeyResultChange(text, index)}
                  placeholder={`关键结果 ${index + 1}`}
                  style={{ flex: 1 }}
                >
                  <Text>关键结果 {index + 1}</Text>
                </InputItem>
                <Button onPress={() => handleDeleteKeyResult(index)} style={styles.deleteButton}>
                  <Icon name="delete" size="md" />
                </Button>
              </View>
            ))}
          </>
          <Button onPress={handleAddKeyResult} style={styles.addButton}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Icon name="plus" size="md" />
              <View style={{ marginLeft: 8 }}>
                添加关键结果
              </View>
            </View>
          </Button>
        </List>
        <Button type="primary" onPress={handleUpdateGoal} style={styles.buttonContainer}>
          更新目标
        </Button>
      </View>
    </Provider>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
  addButton: {
    marginTop: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
});