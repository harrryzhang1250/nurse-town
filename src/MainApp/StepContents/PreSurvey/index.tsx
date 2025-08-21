import { useState, useEffect } from 'react';
import SurveyContent from '../../../shared/SurveyContent';
import * as client from './client';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted, setPreSurvey, selectPreSurvey } from '../../../reducer';
import type { RootState } from '../../../store';
import { Box } from '@mantine/core';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { updateUserAttributes } from 'aws-amplify/auth';

// Use a flexible type that can handle any survey structure
export type SurveyResponse = Record<string, number | null | string>;

export default function PreSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/pre-survey')(state));
  const preSurveyFromRedux = useSelector((state: RootState) => selectPreSurvey(state));
  const { user } = useAuthenticator((context) => [context.user]);

  const [responses, setResponses] = useState<SurveyResponse>({});



  const getSurvey = async () => {
    if (!user?.username) return;
    
    try {
      const survey = await client.getSurvey(user.username) as any;
      if (survey?.answers) {
        // Backend now handles number conversion, so we can use the data directly
        const surveyData = survey.answers as SurveyResponse;
        setResponses(surveyData);
        // Save to Redux store
        dispatch(setPreSurvey(surveyData));
      }
    } catch (error) {
      // 忽略获取错误
    }
  }

  // Load data from Redux if available, otherwise fetch from server
  useEffect(() => {
    if (preSurveyFromRedux) {
      // Use data from Redux store
      setResponses(preSurveyFromRedux);
    } else {
      // Fetch from server and save to Redux
      getSurvey();
    }
  }, [user?.username, isCompleted, preSurveyFromRedux]);

  const handleRatingChange = (field: keyof SurveyResponse, value: number) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (field: keyof SurveyResponse, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    try {
      const submissionData = {
        userID: user.username,
        answers: responses,
      };
      
      await client.submitSurvey(submissionData);
      
      // Update the current completed step in Cognito
      await updateUserAttributes({
        userAttributes: {
          'custom:currentCompletedStep': 'pre-survey'
        }
      });
      
      // Save to Redux store after successful submission
      dispatch(setPreSurvey(responses));
      dispatch(completeStep('/pre-survey'));
      navigate('/simulation-tutorial');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  const questions = [
    {
      field: 'I feel confident interviewing a client with expressive aphasia' as keyof SurveyResponse,
      text: 'I feel confident interviewing a client with expressive aphasia'
    },
    {
      field: 'I feel prepared to modify my language for clients with communication challenges' as keyof SurveyResponse,
      text: 'I feel prepared to modify my language for clients with communication challenges'
    },
    {
      field: 'I can interpret and apply hospital discharge documentation effectively' as keyof SurveyResponse,
      text: 'I can interpret and apply hospital discharge documentation effectively'
    },
    {
      field: 'I know how to show empathy while gathering clinical information' as keyof SurveyResponse,
      text: 'I know how to show empathy while gathering clinical information'
    },
    {
      field: 'I feel confident responding to unexpected client behavior during sessions' as keyof SurveyResponse,
      text: 'I feel confident responding to unexpected client behavior during sessions'
    },
    {
      field: 'I believe this simulation will help me build skills I can apply in real clinical settings' as keyof SurveyResponse,
      text: 'I believe this simulation will help me build skills I can apply in real clinical settings'
    }
  ];



  return (
    <Box
      style={{
        paddingTop: '50px', // Account for TopBar
        height: 'calc(100vh - 100px)',
        background: 'white',
        boxSizing: 'border-box',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <SurveyContent<SurveyResponse>
        responses={responses}
        questions={questions}
        singleOpenEndedQuestion={{
          field: 'What are you hoping to gain from this simulation experience?',
          text: 'What are you hoping to gain from this simulation experience?'
        }}
        isCompleted={isCompleted}
        onRatingChange={handleRatingChange}
        onTextChange={handleTextChange}
        onSubmit={handleSubmit}
        title="Pre-Simulation Survey"
        ratingScale={{
          min: 1,
          max: 6,
          leftLabel: 'Not confident at all',
          rightLabel: 'Extremely confident'
        }}
      />
    </Box>
  );
};

