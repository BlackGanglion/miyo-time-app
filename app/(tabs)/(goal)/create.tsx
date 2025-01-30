import React, { useState } from 'react';
import { Button, InputItem, List, DatePicker, Provider, Toast, Icon } from '@ant-design/react-native';
import { View, StyleSheet, Text } from 'react-native';
import { fetchData } from '@/api/http';
import { useRouter } from 'expo-router';

export default function CreateGoal() {
  const [goalName, setGoalName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [keyResults, setKeyResults] = useState<Array<{ resultName: string }>>([]);
  const router = useRouter();

  const handleCreateGoal = async () => {
    try {
      const data = await fetchData('/goals', 'POST', {
        goalName, startTime, endTime, keyResults: keyResults,
      });

      // 显示成功消息
      Toast.success('目标创建成功', 1);
      router.push('/(tabs)/(goal)');
    } catch (error) {
      // 处理错误
      Toast.fail('目标创建失败，请重试', 1);
    }
  };

  const handleAddKeyResult = () => {
    setKeyResults([...keyResults, { resultName: '' }]);
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
        </List>
        <Button onPress={handleAddKeyResult} style={styles.addButton}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Icon name="plus" size="md" />
            <View style={{ marginLeft: 8 }}>
              <Text>添加关键结果</Text>
            </View>
          </View>
        </Button>
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
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
  deleteButton: {
    marginLeft: 8,
  },
  addButton: {
    marginTop: 16,
  },
});
