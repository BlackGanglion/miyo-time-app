import React, { useState } from 'react';
import { Button, Input, List, DatePicker, Provider, Toast, Icon } from '@ant-design/react-native';
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
          <Input
            value={goalName}
            onChangeText={setGoalName}
            placeholder="请输入目标名称"
          />
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
                <Input
                  value={keyResult.resultName}
                  onChangeText={(text) => handleKeyResultChange(text, index)}
                  placeholder={`请输入关键结果 ${index + 1}`}
                  style={{ flex: 1 }}
                />
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
            <Text style={{ marginLeft: 8 }}>添加关键结果</Text>
          </View>
        </Button>
        <Button type="primary" onPress={handleCreateGoal} style={styles.buttonContainer}>
          <Text>创建目标</Text>
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
