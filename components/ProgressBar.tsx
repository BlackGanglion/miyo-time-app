import { View, Text, StyleSheet } from 'react-native';

export const ProgressBar = ({ progress = 0, color = '#3b82f6', height = 20 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${progress}%`,
            backgroundColor: color,
          },
        ]}
      />
      <Text style={styles.progressText}>{`${progress}%`}</Text>
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
