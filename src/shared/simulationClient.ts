import { post, get } from 'aws-amplify/api';

// 配置：是否使用真实API（部署完成后设为true）
const USE_REAL_API = true; // 重新启用真实API

// 获取用户的Simulation debrief数据
export const getDebrief = async (userID: string, simulationLevel: number) => {
  try {
    if (!USE_REAL_API) {
      console.log(`getDebrief called for userID: ${userID}, level: ${simulationLevel}`);
      return null; // 模拟没有找到数据
    }

    // 真实API调用
    const restOperation = get({
      apiName: 'NurseTownAPI',
      path: `debrief?userID=${userID}&simulationLevel=${simulationLevel}`,
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error getting debrief:', error);
    if (!USE_REAL_API) {
      return null; // 模拟模式下忽略错误
    }
    throw error;
  }
};

// 提交Simulation debrief数据
export const submitDebrief = async (submissionData: {
  userID: string;
  simulationLevel: number;
  answers: any;
}) => {
  try {
    if (!USE_REAL_API) {
      console.log('Submitting debrief data:', submissionData);
      // 模拟API响应
      return { message: `Level ${submissionData.simulationLevel} Simulation debrief submitted` };
    }

    // 真实API调用
    const restOperation = post({
      apiName: 'NurseTownAPI',
      path: 'debrief',
      options: {
        body: submissionData
      }
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error submitting debrief:', error);
    throw error;
  }
};
