import { useState, useEffect } from 'react';
import SurveyContent from '../../../shared/SurveyContent';
import * as client from './client';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted, setPostSurvey, selectPostSurvey } from '../../../reducer';
import type { RootState } from '../../../store';
import { Box } from '@mantine/core';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { updateUserAttributes } from 'aws-amplify/auth';


// Use a flexible type that can handle any survey structure
export type SurveyResponse = Record<string, number | null | string>;

export default function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/post-survey')(state));
  const postSurveyFromRedux = useSelector((state: RootState) => selectPostSurvey(state));
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
        dispatch(setPostSurvey(surveyData));
      }
    } catch (error) {
      // 忽略获取错误
    }
  }

  // Load data from Redux if available, otherwise fetch from server
  useEffect(() => {
    if (postSurveyFromRedux) {
      // Use data from Redux store
      setResponses(postSurveyFromRedux);
    } else {
      // Fetch from server and save to Redux
      getSurvey();
    }
  }, [user?.username, isCompleted, postSurveyFromRedux]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRatingChange = (field: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (field: string, value: string) => {
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
          'custom:currentCompletedStep': 'post-survey'
        }
      });
      
      // Save to Redux store after successful submission
      dispatch(setPostSurvey(responses));
      dispatch(completeStep('/post-survey'));
      navigate('/completion');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  const questions = [
    {
      field: 'I feel more confident interviewing a client with expressive aphasia' as keyof SurveyResponse,
      text: 'I feel more confident interviewing a client with expressive aphasia'
    },
    {
      field: 'I feel better prepared to modify my language for clients with communication challenges' as keyof SurveyResponse,
      text: 'I feel better prepared to modify my language for clients with communication challenges'
    },
    {
      field: 'I can interpret and apply hospital discharge documentation more effectively' as keyof SurveyResponse,
      text: 'I can interpret and apply hospital discharge documentation more effectively'
    },
    {
      field: 'I know how to show empathy while gathering clinical information' as keyof SurveyResponse,
      text: 'I know how to show empathy while gathering clinical information'
    },
    {
      field: 'I feel more confident responding to unexpected client behavior during sessions' as keyof SurveyResponse,
      text: 'I feel more confident responding to unexpected client behavior during sessions'
    },
    {
      field: 'This simulation helped me build transferable clinical skills' as keyof SurveyResponse,
      text: 'This simulation helped me build transferable clinical skills'
    },
    {
      field: 'The simulation layout and environment felt well-designed' as keyof SurveyResponse,
      text: 'The simulation layout and environment felt well-designed'
    },
    {
      field: 'The interface was easy to navigate' as keyof SurveyResponse,
      text: 'The interface was easy to navigate'
    },
    {
      field: "The patient's communication felt authentic for Broca's aphasia" as keyof SurveyResponse,
      text: "The patient's communication felt authentic for Broca's aphasia"
    },
    {
      field: "Facial expressions and gestures matched the patient's condition" as keyof SurveyResponse,
      text: "Facial expressions and gestures matched the patient's condition"
    },
    {
      field: "The patient's voice and responses felt natural and appropriate" as keyof SurveyResponse,
      text: "The patient's voice and responses felt natural and appropriate"
    },
    {
      field: 'The system scoring I received accurately reflected my clinical performance' as keyof SurveyResponse,
      text: 'The system scoring I received accurately reflected my clinical performance'
    },
    {
      field: 'The feedback helped me identify specific areas for improvement' as keyof SurveyResponse,
      text: 'The feedback helped me identify specific areas for improvement'
    },
    {
      field: 'I would use this platform to practice independently if it were available' as keyof SurveyResponse,
      text: 'I would use this platform to practice independently if it were available'
    },
    {
      field: 'The platform gives me more chances to interact with standardized patients, which is helpful' as keyof SurveyResponse,
      text: 'The platform gives me more chances to interact with standardized patients, which is helpful'
    },
    {
      field: 'With this platform, I felt more comfortable practicing without being observed by other people' as keyof SurveyResponse,
      text: 'With this platform, I felt more comfortable practicing without being observed by other people'
    },
    {
      field: 'The simulation allowed me to pause, reflect, and retry without judgment' as keyof SurveyResponse,
      text: 'The simulation allowed me to pause, reflect, and retry without judgment'
    },
    {
      field: 'This platform helped me recognize growth areas I might miss in real-time' as keyof SurveyResponse,
      text: 'This platform helped me recognize growth areas I might miss in real-time'
    },
    {
      field: 'I would recommend this simulation platform to other students' as keyof SurveyResponse,
      text: 'I would recommend this simulation platform to other students'
    }
  ];

  const openEndedQuestions = [
    {
      field: 'What aspects of the simulation felt most helpful?' as keyof SurveyResponse,
      text: 'What aspects of the simulation felt most helpful?'
    },
    {
      field: 'What new knowledge or skill did you gain?' as keyof SurveyResponse,
      text: 'What new knowledge or skill did you gain?'
    },
    {
      field: 'What aspects could be improved?' as keyof SurveyResponse,
      text: 'What aspects could be improved?'
    },
    {
      field: 'Were there any moments where the simulation didn\'t respond as expected? Please explain.' as keyof SurveyResponse,
      text: 'Were there any moments where the simulation didn\'t respond as expected? Please explain.'
    },
    {
      field: 'What features would make this platform better for future learners?' as keyof SurveyResponse,
      text: 'What features would make this platform better for future learners?'
    }
  ];



  return (
    <Box
      style={{
        paddingTop: '50px', // Account for TopBar
        minHeight: '100vh',
        background: 'white',
        boxSizing: 'border-box',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <SurveyContent<SurveyResponse>
        responses={responses}
        questions={questions}
        openEndedQuestions={openEndedQuestions}
        isCompleted={isCompleted}
        onRatingChange={handleRatingChange}
        onTextChange={handleTextChange}
        onSubmit={handleSubmit}
        title="Post-Simulation Survey"
        ratingScale={{
          min: 1,
          max: 6,
          leftLabel: 'Strongly disagree',
          rightLabel: 'Strongly agree'
        }}
      />
    </Box>
  );
} 