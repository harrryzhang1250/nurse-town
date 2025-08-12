import { useState, useEffect } from 'react';
import SurveyContent from '../../../shared/SurveyContent';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import { Box } from '@mantine/core';
import { useAuthenticator } from '@aws-amplify/ui-react';

export interface SurveyResponse {
  [key: string]: number | null | string;
  expressiveAphasia: number | null;
  modifyLanguage: number | null;
  hospitalDischarge: number | null;
  showEmpathy: number | null;
  unexpectedBehavior: number | null;
  transferableSkills: number | null;
  layoutDesign: number | null;
  easyNavigation: number | null;
  authenticCommunication: number | null;
  facialExpressions: number | null;
  voiceResponses: number | null;
  systemScoring: number | null;
  feedbackHelpful: number | null;
  useIndependently: number | null;
  standardizedPatients: number | null;
  comfortablePracticing: number | null;
  pauseReflect: number | null;
  recognizeGrowth: number | null;
  recommendPlatform: number | null;
  openEnded1: string;
  openEnded2: string;
  openEnded3: string;
  openEnded4: string;
  openEnded5: string;
}

export default function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/post-survey')(state));
  const { user } = useAuthenticator((context) => [context.user]);

  const [responses, setResponses] = useState<SurveyResponse>({
    expressiveAphasia: null,
    modifyLanguage: null,
    hospitalDischarge: null,
    showEmpathy: null,
    unexpectedBehavior: null,
    transferableSkills: null,
    layoutDesign: null,
    easyNavigation: null,
    authenticCommunication: null,
    facialExpressions: null,
    voiceResponses: null,
    systemScoring: null,
    feedbackHelpful: null,
    useIndependently: null,
    standardizedPatients: null,
    comfortablePracticing: null,
    pauseReflect: null,
    recognizeGrowth: null,
    recommendPlatform: null,
    openEnded1: '',
    openEnded2: '',
    openEnded3: '',
    openEnded4: '',
    openEnded5: ''
  });

  useEffect(() => {
    // Placeholder for any post-survey initialization if needed
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

    console.log(submissionData);
    dispatch(completeStep('/post-survey'));
    navigate('/sign-up-interview');
  };

  const questions = [
    {
      field: 'expressiveAphasia' as keyof SurveyResponse,
      text: 'I feel more confident interviewing a client with expressive aphasia'
    },
    {
      field: 'modifyLanguage' as keyof SurveyResponse,
      text: 'I feel better prepared to modify my language for clients with communication challenges'
    },
    {
      field: 'hospitalDischarge' as keyof SurveyResponse,
      text: 'I can interpret and apply hospital discharge documentation more effectively'
    },
    {
      field: 'showEmpathy' as keyof SurveyResponse,
      text: 'I know how to show empathy while gathering clinical information'
    },
    {
      field: 'unexpectedBehavior' as keyof SurveyResponse,
      text: 'I feel more confident responding to unexpected client behavior during sessions'
    },
    {
      field: 'transferableSkills' as keyof SurveyResponse,
      text: 'This simulation helped me build transferable clinical skills'
    },
    {
      field: 'layoutDesign' as keyof SurveyResponse,
      text: 'The simulation layout and environment felt well-designed'
    },
    {
      field: 'easyNavigation' as keyof SurveyResponse,
      text: 'The interface was easy to navigate'
    },
    {
      field: 'authenticCommunication' as keyof SurveyResponse,
      text: "The patient's communication felt authentic for Broca's aphasia"
    },
    {
      field: 'facialExpressions' as keyof SurveyResponse,
      text: "Facial expressions and gestures matched the patient's condition"
    },
    {
      field: 'voiceResponses' as keyof SurveyResponse,
      text: "The patient's voice and responses felt natural and appropriate"
    },
    {
      field: 'systemScoring' as keyof SurveyResponse,
      text: 'The system scoring I received accurately reflected my clinical performance'
    },
    {
      field: 'feedbackHelpful' as keyof SurveyResponse,
      text: 'The feedback helped me identify specific areas for improvement'
    },
    {
      field: 'useIndependently' as keyof SurveyResponse,
      text: 'I would use this platform to practice independently if it were available'
    },
    {
      field: 'standardizedPatients' as keyof SurveyResponse,
      text: 'The platform gives me more chances to interact with standardized patients, which is helpful'
    },
    {
      field: 'comfortablePracticing' as keyof SurveyResponse,
      text: 'With this platform, I felt more comfortable practicing without being observed by other people'
    },
    {
      field: 'pauseReflect' as keyof SurveyResponse,
      text: 'The simulation allowed me to pause, reflect, and retry without judgment'
    },
    {
      field: 'recognizeGrowth' as keyof SurveyResponse,
      text: 'This platform helped me recognize growth areas I might miss in real-time'
    },
    {
      field: 'recommendPlatform' as keyof SurveyResponse,
      text: 'I would recommend this simulation platform to other students'
    }
  ];

  const openEndedQuestions = [
    {
      field: 'openEnded1' as keyof SurveyResponse,
      text: 'What aspects of the simulation felt most helpful?'
    },
    {
      field: 'openEnded2' as keyof SurveyResponse,
      text: 'What new knowledge or skill did you gain?'
    },
    {
      field: 'openEnded3' as keyof SurveyResponse,
      text: 'What aspects could be improved?'
    },
    {
      field: 'openEnded4' as keyof SurveyResponse,
      text: 'Were there any moments where the simulation didn\'t respond as expected? Please explain.'
    },
    {
      field: 'openEnded5' as keyof SurveyResponse,
      text: 'What features would make this platform better for future learners?'
    }
  ];

  const isFormValid = () => {
    const allRatingsAnswered = questions.every(question => 
      responses[question.field] !== null && responses[question.field] !== 0
    );
    const allOpenEndedAnswered = openEndedQuestions.every(question =>
      (responses[question.field] as string).trim() !== ''
    );
    return allRatingsAnswered && allOpenEndedAnswered;
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
        openEndedQuestions={openEndedQuestions}
        formValid={formValid}
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