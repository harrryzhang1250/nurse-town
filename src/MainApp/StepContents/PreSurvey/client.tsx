import axios from 'axios';

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
if (!REMOTE_SERVER) {
  throw new Error('REMOTE_SERVER is not defined');
}

export const PRE_SURVEY_API = `${REMOTE_SERVER}/pre-survey`;

export const submitSurvey = async (data: any) => {
  const response = await axios.post(PRE_SURVEY_API, data);
  return response.data;
};

export const getSurvey = async (userId: string) => {
    const response = await axios.get(
      PRE_SURVEY_API,
      {
        params: { userID: userId } 
      }
    );
    return response.data;
  };
