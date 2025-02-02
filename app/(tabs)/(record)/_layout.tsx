import { Stack } from 'expo-router';

export default function RecordLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '时间管理' }} />
      <Stack.Screen name="create" options={{ title: '创建记录' }} />
    </Stack>
  )
}