import { useState, useEffect } from 'react';
import SurveyContent from './SurveyContent';
import SubmitSuccess from './SubmitSuccess';
import * as client from './client';

export interface SurveyResponse {
  expressiveAphasia: number | null;
  modifyLanguage: number | null;
  hospitalDischarge: number | null;
  showEmpathy: number | null;
  unexpectedBehavior: number | null;
  simulationSkills: number | null;
  openEnded: string;
}

export default function PreSurvey() {
  const [responses, setResponses] = useState<SurveyResponse>({
    expressiveAphasia: null,
    modifyLanguage: null,
    hospitalDischarge: null,
    showEmpathy: null,
    unexpectedBehavior: null,
    simulationSkills: null,
    openEnded: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const getSurvey = async () => {
      const response = await client.getSurvey(searchParams.get('userID') || '');
      if (response){
        setIsSubmitted(true);
      }
    }
    getSurvey();
    setUrlParams(searchParams);
  }, []);

  const getUrlParam = (paramName: string): string | null => {
    return urlParams?.get(paramName) || null;
  };

  const handleRatingChange = (field: keyof SurveyResponse, value: number) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      openEnded: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        answers: responses,
        userID: getUrlParam('userID'),
      };

      console.log(submissionData);
      
      const response = await client.submitSurvey(submissionData);
      console.log('Survey submitted successfully:', response);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
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

  return isSubmitted ? (
    <SubmitSuccess />
  ) : (
    <SurveyContent
      responses={responses}
      questions={questions}
      formValid={formValid}
      onRatingChange={handleRatingChange}
      onTextChange={handleTextChange}
      onSubmit={handleSubmit}
    />
  );
};
