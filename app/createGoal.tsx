import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, InputItem, List, DatePicker, Provider } from '@ant-design/react-native';

export default function CreateGoal() {
  const [goalName, setGoalName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleCreateGoal = () => {
    console.log('Goal Created:', { goalName, startTime, endTime });
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
