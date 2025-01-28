import axios from 'axios';

// 创建一个 axios 实例
const http = axios.create({
  baseURL: 'http://192.168.1.15:3000', // 替换为你的 API 基础 URL
  timeout: 1000, // 请求超时时间
});

// 公共请求方法
export const fetchData = async (endpoint: string, method = 'GET', data = {}, options = {}) => {
  try {
    const response = await http.request({
      url: endpoint,
      method: method.toLowerCase(), // 确保方法是小写
      data: method.toLowerCase() === 'post' ? data : {}, // 仅在 POST 请求时传递数据
      ...options
    });

    // 统一处理响应数据
    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error('请求失败: ' + JSON.stringify(response.data.data));
    }
  } catch (error) {
    console.error('HTTP 请求失败:', error);
    throw error;
  }
};