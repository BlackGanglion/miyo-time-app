import { Stack } from 'expo-router';

export default function GoalLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
    </Stack>
  )
}