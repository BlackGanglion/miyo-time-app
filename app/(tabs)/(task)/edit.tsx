import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { fetchData } from '@/api/http';
import { DatePicker, Input, List, Picker, Provider, Toast, Button } from '@ant-design/react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import CronEditor from '@/components/CronEditor';
import { taskTypeOptions } from './create';

export default function TaskEditScreen() {
  const router = useRouter();
  const { taskId } = useGlobalSearchParams();

  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('single');
  const [taskTime, setTaskTime] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedKeyResult, setSelectedKeyResult] = useState<string | null>(null);
  const [taskCron, setTaskCron] = useState('');

  // 获取目标列表的 API
  const fetchGoals = async () => {
    const data = await fetchData('/goals', 'GET');
    setGoals(data);
  };

  // 获取任务详情
  const fetchTaskDetails = async (id: string) => {
    try {
      const task = await fetchData(`/tasks/${id}`, 'GET');
      setTaskName(task.taskName);
      setTaskType(task.taskCron ? 'interval' : 'single');
      setTaskTime(task.taskTime || '');
      setTaskCron(task.taskCron || '');
      setSelectedGoal(task.goal.id);
      setSelectedKeyResult(task.keyResult.id);
    } catch (error) {
      Toast.fail('获取任务详情失败，请重试', 1);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId as string);
    }
  }, [taskId]);

  // 提交编辑的任务
  const handleSubmit = async () => {
    try {
      const taskData = {
        taskName,
        taskTime: taskTime || null,
        taskCron: taskCron || null,
        keyResultId: selectedKeyResult,
      };

      await fetchData(`/tasks/${taskId}`, 'PUT', taskData);

      // 显示成功消息
      Toast.success('任务更新成功', 1);
      router.push('/(tabs)/(task)');
    } catch (error) {
      Toast.fail('更新任务失败，请重试', 1);
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
              setSelectedKeyResult(null);
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
          更新任务
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
