import { post, get } from 'aws-amplify/api';

// 配置：是否使用真实API（部署完成后设为true）
const USE_REAL_API = true; // 重新启用真实API

// 获取用户的post-survey数据
export const getSurvey = async (userID: string) => {
  try {
    if (!USE_REAL_API) {
      console.log('getSurvey called for userID:', userID);
      return null; // 模拟没有找到数据
    }

    // 真实API调用
    const restOperation = get({
      apiName: 'NurseTownAPI',
      path: `post-survey?userID=${userID}`,
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error getting survey:', error);
    if (!USE_REAL_API) {
      return null; // 模拟模式下忽略错误
    }
    throw error;
  }
};

// 提交post-survey数据
export const submitSurvey = async (submissionData: {
  userID: string;
  answers: any;
}) => {
  try {
    if (!USE_REAL_API) {
      console.log('Submitting survey data:', submissionData);
      // 模拟API响应
      return { message: "Post survey submitted" };
    }

    // 真实API调用
    const restOperation = post({
      apiName: 'NurseTownAPI',
      path: 'post-survey',
      options: {
        body: submissionData
      }
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};
