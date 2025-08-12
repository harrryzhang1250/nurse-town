import { useState, useEffect } from 'react';
import SurveyContent from '../../../shared/SurveyContent';
// import * as client from './client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { completeStep } from '../../../reducer';
import { Box } from '@mantine/core';
import { useAuthenticator } from '@aws-amplify/ui-react';

export interface SurveyResponse {
  [key: string]: number | null | string;
  expressiveAphasia: number | null;
  modifyLanguage: number | null;
  hospitalDischarge: number | null;
  showEmpathy: number | null;
  unexpectedBehavior: number | null;
  simulationSkills: number | null;
  openEnded: string;
}

export default function PreSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/pre-survey')(state));
  const { user } = useAuthenticator((context) => [context.user]);

  const [responses, setResponses] = useState<SurveyResponse>({
    expressiveAphasia: null,
    modifyLanguage: null,
    hospitalDischarge: null,
    showEmpathy: null,
    unexpectedBehavior: null,
    simulationSkills: null,
    openEnded: ''
  });

  useEffect(() => {
    // const getSurvey = async () => {
    //   const response = await client.getSurvey(searchParams.get('userID') || '');
    //   if (response){
    //     setIsSubmitted(true);
    //   }
    // }
    // getSurvey();
    // setUrlParams(searchParams);
  }, []);


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
    const submissionData = {
      answers: responses,
      userID: user?.username,
    };
    
    // await client.submitSurvey(submissionData);
    console.log(submissionData);
    dispatch(completeStep('/pre-survey'));
    navigate('/sign-up-study');

  };

  const questions = [
    {
      field: 'expressiveAphasia' as keyof SurveyResponse,
      text: 'I feel confident interviewing a client with expressive aphasia'
    },
    {
      field: 'modifyLanguage' as keyof SurveyResponse,
      text: 'I feel prepared to modify my language for clients with communication challenges'
    },
    {
      field: 'hospitalDischarge' as keyof SurveyResponse,
      text: 'I can interpret and apply hospital discharge documentation effectively'
    },
    {
      field: 'showEmpathy' as keyof SurveyResponse,
      text: 'I know how to show empathy while gathering clinical information'
    },
    {
      field: 'unexpectedBehavior' as keyof SurveyResponse,
      text: 'I feel confident responding to unexpected client behavior during sessions'
    },
    {
      field: 'simulationSkills' as keyof SurveyResponse,
      text: 'I believe this simulation will help me build skills I can apply in real clinical settings'
    }
  ];

  const isFormValid = () => {
    const allRatingsAnswered = questions.every(question => 
      responses[question.field] !== null && responses[question.field] !== 0
    );
    const openEndedAnswered = responses.openEnded.trim() !== '';
    return allRatingsAnswered && openEndedAnswered;
  };

  const formValid = isFormValid();

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
        singleOpenEndedQuestion={{
          field: 'openEnded',
          text: 'What are you hoping to gain from this simulation experience?'
        }}
        formValid={formValid}
        onRatingChange={handleRatingChange}
        onTextChange={handleTextChange}
        onSubmit={handleSubmit}
        title="Pre-Simulation Survey"
        ratingScale={{
          min: 0,
          max: 5,
          leftLabel: 'Not confident at all',
          rightLabel: 'Extremely confident'
        }}
      />
    </Box>
  );
};

