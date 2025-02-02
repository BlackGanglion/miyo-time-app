import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { List, Card, Provider, Toast, Modal, Icon, Checkbox } from '@ant-design/react-native';
import { router } from 'expo-router';
import { fetchData } from '@/api/http';

function TaskCard(
  { task, onDelete, onEdit, onToggleComplete }: { task: any; onDelete: () => void; onEdit: () => void; onToggleComplete: (e: any) => void; }
) {
  // 判断任务类型
  const taskType = task.taskTime ? '单次' : task.taskCron ? '周期' : '未定义';

  // 解析 cron 表达式以获取执行频率
  const getCronDescription = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length === 5) {
      const dayOfWeek = parts[4];
      if (dayOfWeek === '*') {
        return '每天执行';
      } else {
        const days = dayOfWeek.split(',').map(day => {
          switch (day) {
            case '0': return '星期日';
            case '1': return '星期一';
            case '2': return '星期二';
            case '3': return '星期三';
            case '4': return '星期四';
            case '5': return '星期五';
            case '6': return '星期六';
            default: return '';
          }
        });
        return `每周 ${days.join(', ')}`;
      }
    }
    return '未定义';
  };

  return (
    <Card style={styles.card}>
      <Card.Header
        title={
          <View style={styles.headerContent}>
            <Checkbox
              checked={task.status === 'COMPLETED'}
              onChange={onToggleComplete}
            />
            <Text style={styles.taskNameText}>{task.taskName}</Text>
          </View>
        }
        extra={
          <View style={styles.headerExtra}>
            <TouchableOpacity onPress={onEdit} style={{ marginLeft: 10 }}>
              <Icon name="edit" size="md" color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{ marginLeft: 10 }}>
              <Icon name="delete" size="md" color="red" />
            </TouchableOpacity>
          </View>
        }
      />
      {/* @ts-ignore */}
      <Card.Body style={styles.cardBody}>
        <View>
          {task.taskTime ? (
            <Text style={styles.dueDateText}>
              {taskType} 截止时间: {new Date(task.taskTime).toLocaleString()}
            </Text>
          ) : null}
          {task.taskCron ? (
            <Text style={styles.dueDateText}>
              {taskType} 执行频率: {getCronDescription(task.taskCron)}
            </Text>
          ) : null}
          {task.goal ? (
            <Text style={styles.dueDateText}>
              关联目标: {task.goal.goalName}
            </Text>
          ) : <Text style={styles.dueDateText}>
            无目标关联
          </Text>}
          {task.keyResult && (
            <Text style={styles.dueDateText}>
              关联关键结果: {task.keyResult.resultName}
            </Text>
          )}
        </View>
      </Card.Body>
    </Card>
  );
}

export default function TaskScreen() {
  const [taskList, setTaskList] = React.useState([]);

  const handleDelete = async (taskId: string) => {
    try {
      await fetchData(`/tasks/${taskId}`, 'DELETE');
      Toast.success('任务已删除', 1);
      fetchTasks(); // 刷新任务列表
    } catch (error) {
      Toast.fail('删除任务失败，请重试', 1);
    }
  };

  const handleAddTask = () => {
    router.push('/(tabs)/(task)/create');
  };

  const handleToggleComplete = async (taskId: string, checked: boolean) => {
    try {
      await fetchData(`/tasks/${taskId}`, 'PUT', { status: checked ? 'COMPLETED' : 'PENDING' });
      fetchTasks(); // 刷新任务列表
    } catch (error) {
      Toast.fail('切换任务状态失败，请重试', 1);
    }
  };

  // 获取任务列表的 API
  const fetchTasks = async () => {
    const data = await fetchData('/tasks', 'GET');
    setTaskList(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>任务列表</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.addButtonText}>+ 创建任务</Text>
          </TouchableOpacity>
        </View>
        <List>
          {taskList.map((task: any, index: number) => (
            <TaskCard
              key={index}
              task={task}
              onDelete={() => {
                Modal.alert(
                  '确认删除',
                  '你确定要删除这个目标吗？',
                  [
                    { text: '取消', style: 'cancel' },
                    { text: '确认', onPress: () => handleDelete(task.id) },
                  ]
                );
              }}
              onEdit={() => {
                router.push(`/(tabs)/(task)/edit?taskId=${task.id}`);
              }}
              onToggleComplete={(e: any) => {
                const checked: boolean = e.target.checked;
                handleToggleComplete(task.id, checked);
              }}
            />
          ))}
        </List>
      </View>
    </Provider>
  );
}

export const styles = StyleSheet.create({
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
  card: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  headerExtra: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 14,
  },
  taskTypeText: {
    fontSize: 16,
    color: '#333',
  },
  cardBody: {
    paddingHorizontal: 15,
  },
  dueDateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskNameText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});
