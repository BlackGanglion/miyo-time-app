import { View, Text, StyleSheet } from 'react-native';

export const ProgressBar = ({ progress = 0, total = 0, color = '#3b82f6', height = 20 }) => {
  const progressPercentage = total ? (progress / total * 100).toFixed(2) : '0';
  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${Number(progressPercentage)}%`,
            backgroundColor: color,
          },
        ]}
      />
      <Text style={styles.progressText}>{`${progress}/${total} (${progressPercentage}%)`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 8,
  },
  progress: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});
