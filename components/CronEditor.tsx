import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List, Picker } from '@ant-design/react-native';

interface CronEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const frequencyOptions = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
];

const dayOfWeekOptions = [
  { label: '星期一', value: '1' },
  { label: '星期二', value: '2' },
  { label: '星期三', value: '3' },
  { label: '星期四', value: '4' },
  { label: '星期五', value: '5' },
  { label: '星期六', value: '6' },
  { label: '星期日', value: '0' },
];

const CronEditor: React.FC<CronEditorProps> = ({ value, onChange }) => {
  const [frequency, setFrequency] = useState('daily');
  const [dayOfWeek, setDayOfWeek] = useState('1');

  // 解析传入的 cron 表达式
  useEffect(() => {
    const parts = value.split(' ');
    if (parts.length === 5) {
      const minute = parts[0];
      const hour = parts[1];
      const day = parts[2];
      const month = parts[3];
      const weekDay = parts[4];

      if (weekDay === '*') {
        setFrequency('daily');
      } else {
        setFrequency('weekly');
        setDayOfWeek(weekDay);
      }
    }
  }, [value]);

  return (
    <>
      <Picker
        data={frequencyOptions}
        cols={1}
        value={[frequency]}
        onChange={(value: any) => {
          setFrequency(value[0]);
          if (value[0] === 'daily') {
            onChange('0 0 * * *');
          }
        }}
      >
        <List.Item arrow="horizontal">选择执行频率:</List.Item>
      </Picker>

      {frequency === 'weekly' && (
        <Picker
          data={dayOfWeekOptions}
          cols={1}
          value={[dayOfWeek]}
          onChange={(value: any) => {
            const dayOfWeek = value[0];
            setDayOfWeek(dayOfWeek);
            if (frequency === 'weekly') {
              onChange(`0 0 * * ${dayOfWeek}`);
            }
          }}
        >
          <List.Item arrow="horizontal">选择执行的星期几:</List.Item>
        </Picker>
      )}
    </>
  );
};

const styles = StyleSheet.create({
});

export default CronEditor;
