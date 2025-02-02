import { Stack } from 'expo-router';

export default function TaskLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '时间管理' }} />
      <Stack.Screen name="create" options={{ title: '创建任务' }} />
      <Stack.Screen name="edit" options={{ title: '更新任务' }} />
    </Stack>
  )
}
