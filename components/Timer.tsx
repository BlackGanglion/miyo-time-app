import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@ant-design/react-native';

const Timer = ({ onChange, time }: { onChange: (startTime: Date, endTime: Date) => void, time: boolean }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // 控制计时是否开始
  const [startTime, setStartTime] = useState<Date | null>(null); // 开始时间
  const [endTime, setEndTime] = useState<Date | null>(null); // 结束时间

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval); // 清理定时器
  }, [isRunning]);

  const formatTime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setSeconds(0);
    setIsRunning(true); // 开始计时
    setStartTime(new Date()); // 记录开始时间
    setEndTime(null); // 重置结束时间
  };

  const handleStop = () => {
    setIsRunning(false); // 停止计时
    setEndTime(new Date()); // 记录结束时间
    onChange(startTime!, new Date());
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <Button type="primary" onPress={isRunning ? handleStop : handleStart}>
        {isRunning ? "完成计时" : time ? "重新开始计时" : "开始计时"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48, // 增大字体
    fontWeight: 'bold',
  },
});

export default Timer;