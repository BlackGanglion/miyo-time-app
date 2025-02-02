import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, List, Picker, Button, Provider, DatePicker, Toast } from '@ant-design/react-native';
import CronEditor from '@/components/CronEditor';
import { fetchData } from '@/api/http';
import { router } from 'expo-router';

export const taskTypeOptions = [
  { label: '单次', value: 'single' },
  { label: '周期', value: 'interval' },
];

export default function TaskCreateScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('single');
  const [taskTime, setTaskTime] = useState('');
  const [taskCron, setTaskCron] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedKeyResult, setSelectedKeyResult] = useState<string | null>(null);

  // 获取目标列表的 API
  const fetchGoals = async () => {
    const data = await fetchData('/goals', 'GET');
    setGoals(data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async () => {
    try {
      const taskData = {
        taskName,
        taskTime: taskTime || null,
        taskCron: taskCron || null,
        keyResultId: selectedKeyResult,
      };

      await fetchData('/tasks', 'POST', taskData);

      // 显示成功消息
      Toast.success('任务创建成功', 1);
      router.push('/(tabs)/(task)');
    } catch (error) {
      // 处理错误
      Toast.fail('任务创建失败，请重试', 1);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* @ts-ignore */}
        <List>
          <List.Item>
            <Input
              value={taskName}
              onChangeText={setTaskName}
              placeholder="请输入任务名称"
              clearButtonMode="while-editing"
            />
          </List.Item>
          <Picker
            data={taskTypeOptions}
            cols={1}
            value={[taskType]}
            onChange={(value: any) => {
              setTaskType(value[0]);
              setTaskTime('');
              setTaskCron('');
            }}
          >
            <List.Item arrow="horizontal">任务类型</List.Item>
          </Picker>
          {taskType === 'single' ? (
            <DatePicker
              value={taskTime ? new Date(taskTime) : undefined}
              onChange={(date) => setTaskTime(date.toISOString())}
              format="YYYY-MM-DD HH:mm:ss"
              precision="second"
            >
              <List.Item arrow="horizontal">任务时间</List.Item>
            </DatePicker>
          ) : null}
          {taskType === 'interval' ? (
            <CronEditor value={taskCron} onChange={setTaskCron} />
          ) : null}
          <Picker
            data={goals.map(goal => ({ label: goal.goalName, value: goal.id }))}
            cols={1}
            value={selectedGoal ? [selectedGoal] : []}
            onChange={(value: any) => {
              setSelectedGoal(value[0]);
              setSelectedKeyResult(null); // 重置关键结果
            }}
          >
            <List.Item arrow="horizontal">选择目标:</List.Item>
          </Picker>
          {selectedGoal ? (
            <Picker
              data={goals.find(goal => goal.id === selectedGoal)?.keyResults.map((kr: any) => ({ label: kr.resultName, value: kr.id })) || []}
              cols={1}
              value={selectedKeyResult ? [selectedKeyResult] : []}
              onChange={(value: any) => setSelectedKeyResult(value[0])}
            >
              <List.Item arrow="horizontal">选择关键结果:</List.Item>
            </Picker>
          ) : null}
        </List>
        <Button type="primary" onPress={handleSubmit} style={styles.buttonContainer}>
          创建任务
        </Button>
      </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
});
