import { DatePicker, Input, List, Provider, Picker, Button, Toast } from "@ant-design/react-native";
import { View, StyleSheet } from "react-native";
import Timer from '@/components/Timer';
import { useState, useEffect } from "react";
import { fetchData } from '@/api/http';
import { router } from "expo-router";

export default function RecordScreen() {
  const [time, setTime] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [startTime, setStartTime] = useState(''); // 开始时间
  const [endTime, setEndTime] = useState(''); // 结束时间
  const [tasks, setTasks] = useState<any[]>([]); // 存储任务列表
  const [selectedTask, setSelectedTask] = useState<string | null>(null); // 存储选中的任务
  const [categories, setCategories] = useState<any[]>([]); // 存储分类列表
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 存储选中的分类
  const [newCategory, setNewCategory] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await fetchData('/tasks', 'GET');
      setTasks(data);
    } catch (error) {
      console.error('获取任务失败', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchData('/records/category', 'GET');
      setCategories(data);
    } catch (error) {
      console.error('获取分类失败', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      const recordData = {
        recordName,
        startTime,
        endTime,
        taskId: selectedTask,
        category: newCategory || selectedCategory || null,
      };

      await fetchData('/records', 'POST', recordData);

      // 显示成功消息
      Toast.success('记录创建成功', 1);
      router.push('/(tabs)/(record)');
    } catch (error) {
      // 处理错误
      Toast.fail('记录创建失败，请重试', 1);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Timer time={time} onChange={(startTime: Date, endTime: Date) => {
          setTime(true);
          setStartTime(startTime.toISOString());
          setEndTime(endTime.toISOString());
        }} />
        <List>
          <List.Item>
            <Input
              value={recordName}
              onChangeText={setRecordName}
              placeholder="请输入记录名称"
              clearButtonMode="while-editing"
            />
          </List.Item>
          <DatePicker
            value={startTime ? new Date(startTime) : undefined}
            onChange={(date) => setStartTime(date.toISOString())}
            format="YYYY-MM-DD HH:mm:ss"
            precision="second"
          >
            <List.Item arrow="horizontal">开始时间</List.Item>
          </DatePicker>
          <DatePicker
            value={endTime ? new Date(endTime) : undefined}
            onChange={(date) => setEndTime(date.toISOString())}
            format="YYYY-MM-DD HH:mm:ss"
            precision="second"
          >
            <List.Item arrow="horizontal">结束时间</List.Item>
          </DatePicker>
          <Picker
            data={tasks.map(task => ({ label: task.taskName, value: task.id }))}
            cols={1}
            value={selectedTask ? [selectedTask] : []}
            onChange={(value: any) => setSelectedTask(value[0])}
          >
            <List.Item arrow="horizontal">选择关联任务</List.Item>
          </Picker>
          <Picker
            data={categories.map(category => ({ label: category.category, value: category.category }))}
            cols={1}
            value={selectedCategory ? [selectedCategory] : []}
            onChange={(value: any) => setSelectedCategory(value[0])}
          >
            <List.Item arrow="horizontal">选择分类</List.Item>
          </Picker>
          <List.Item>
            <Input
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="添加新分类（如果没有找到合适的）"
              clearButtonMode="while-editing"
            />
          </List.Item>
        </List>
        <Button type="primary" onPress={handleSubmit} style={styles.buttonContainer}>
          创建记录
        </Button>
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
  buttonContainer: {
    marginTop: 16,
  },
});
