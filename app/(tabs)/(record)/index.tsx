import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Provider, Collapse, Radio, List, Icon, Tag, Modal, Toast } from '@ant-design/react-native';
import { router } from 'expo-router';
import { fetchData } from '@/api/http';

const Item = List.Item;

const RecordItem = ({ record, index, handleDelete }: { record: any, index: number, handleDelete: (id: string) => Promise<void> }) => {

  return <Item key={String(index)}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>{record.recordName}</Text>
        <Tag style={{ marginLeft: 8 }} selected>{record.category}</Tag>
      </View>
      <TouchableOpacity onPress={() => {
        Modal.alert(
          '确认删除',
          '你确定要删除这个记录吗？',
          [
            { text: '取消', style: 'cancel' },
            { text: '确认', onPress: () => handleDelete(record.id) },
          ]
        );
      }}>
        <Icon name="delete" size="md" color="red" />
      </TouchableOpacity>
    </View>
    <Text>
      {new Date(record.startTime).toLocaleString()} - {new Date(record.endTime).toLocaleString()}
    </Text>
  </Item>
}

export default function RecordScreen() {
  const [mode, setMode] = useState('date');
  const [dateGroupList, setDateGroupList] = useState([]);
  const [categoryGroupList, setCategoryGroupList] = useState([]);

  const fetchRecords = async () => {
    const endpoint = mode === 'date' ? '/records/groupByDate' : '/records/groupByCategory';
    const data = await fetchData(endpoint);
    if (mode === 'date') {
      setDateGroupList(data);
    } else {
      setCategoryGroupList(data);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [mode]);

  const handleDelete = async (id: string) => {
    try {
      await fetchData(`/records/${id}`, 'DELETE');
      Toast.success('记录已删除', 1);
      fetchRecords();
    } catch (error) {
      Toast.fail('删除记录失败，请重试', 1);
    }
  }

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>记录列表</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => {
            router.push('/(tabs)/(record)/create');
          }}>
            <Text style={styles.addButtonText}>+ 创建记录</Text>
          </TouchableOpacity>
        </View>
        <Radio.Group
          onChange={(e: any) => {
            setMode(e.target.value);
          }}
          value={mode}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 6,
          }}>
          <Radio value="date">按日期</Radio>
          <Radio value="category">按分类</Radio>
        </Radio.Group>
        {mode === 'date' && <Collapse defaultActiveKey={['0']}>
          {dateGroupList.map((group: any, index: number) => {
            return <Collapse.Panel key={String(index)} title={group.date}>
              <List>
                {group.records.map((record: any, index: number) => {
                  return <RecordItem record={record} index={index} handleDelete={handleDelete} />
                })}
              </List>
            </Collapse.Panel>
          })}
        </Collapse>}
        {mode === 'category' && <Collapse defaultActiveKey={['0']}>
          {categoryGroupList.map((group: any, index: number) => {
            return <Collapse.Panel key={String(index)} title={group.category}>
              <List>
                {group.records.map((record: any, index: number) => {
                  return <RecordItem record={record} index={index} handleDelete={handleDelete} />
                })}
              </List>
            </Collapse.Panel>
          })}
        </Collapse>}
      </View>
    </Provider >
  );
}

const styles = StyleSheet.create({
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
});
