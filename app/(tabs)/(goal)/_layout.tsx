import { Stack } from 'expo-router';

export default function GoalLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '时间管理' }} />
      <Stack.Screen name="create" options={{ title: '创建目标' }} />
      <Stack.Screen name="edit" options={{ title: '更新目标' }} />
    </Stack>
  )
}