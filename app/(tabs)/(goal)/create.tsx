import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, InputItem, List, DatePicker, Provider, Modal } from '@ant-design/react-native';
import { fetchData } from '@/api/http';
import { useRouter } from 'expo-router';

export default function CreateGoal() {
  const [goalName, setGoalName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const router = useRouter();

  const handleCreateGoal = async () => {
    try {
      const data = await fetchData('/goals', 'POST', {
        goalName, startTime, endTime
      });

      // 显示成功消息
      Modal.alert('成功', '目标创建成功', [
        { text: '确定', onPress: () => router.push('/(tabs)/(goal)') }
      ]);
    } catch (error) {
      // 处理错误
      Modal.alert('错误', '目标创建失败，请重试');
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
        </List>
        <Button type="primary" onPress={handleCreateGoal} style={styles.buttonContainer}>
          创建目标
        </Button>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginTop: 20, // 添加上间距
  },
});
