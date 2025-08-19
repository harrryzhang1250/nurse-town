import { post, get } from 'aws-amplify/api';

// 获取用户的Simulation debrief数据
export const getDebrief = async (userID: string, simulationLevel: number) => {
  try {
    const restOperation = get({
      apiName: 'NurseTownAPI',
      path: `debrief?userID=${userID}&simulationLevel=${simulationLevel}`,
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error getting debrief:', error);
    throw error;
  }
};

// 获取用户的Chat History数据
export const getSimulationData = async (userID: string, simulationLevel: number) => {
  try {
    const restOperation = get({
      apiName: 'NurseTownAPI',
      path: `simulation-data?userID=${userID}&simulationLevel=${simulationLevel}`,
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error getting simulation data:', error);
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

// 提交Chat History数据
export const submitSimulationData = async (submissionData: any) => {
  try {
    const restOperation = post({
      apiName: 'NurseTownAPI',
      path: 'simulation-data',
      options: {
        body: submissionData
      }
    });

    const response = await restOperation.response;
    const data = await response.body.json();
    
    return data;
  } catch (error) {
    console.error('Error submitting simulation data:', error);
    throw error;
  }
};
