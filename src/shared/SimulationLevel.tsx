import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { updateUserAttributes } from 'aws-amplify/auth';
import SimulationTemplate from './SimulationTemplate';
import SurveyContent from './SurveyContent';
import { completeStep, selectIsStepCompleted, type SurveyResponse } from '../reducer';
import type { RootState } from '../store';
import { getChatHistory } from './simulationClient';

interface SimulationLevelProps {
  level: number;
  setLevelSimulation: (data: SurveyResponse) => { type: string; payload: SurveyResponse };
  getDebrief: (userID: string) => Promise<any>;
  submitDebrief: (data: any) => Promise<any>;
  nextStep: string;
  patientType: string;
  description: string;
}

export default function SimulationLevel({
  level,
  setLevelSimulation,
  getDebrief,
  submitDebrief,
  nextStep,
  patientType,
  description
}: SimulationLevelProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuthenticator((context) => [context.user]);
  
  // Get isCompleted from Redux state
  const isCompleted = useSelector((state: RootState) => 
    selectIsStepCompleted(`/level-${level}-simulation`)(state)
  );
  
  // Get level simulation data from Redux store
  const levelSimulationFromRedux = useSelector((state: RootState) => {
    const currentUserId = state.steps.currentUserId;
    if (!currentUserId) return null;
    
    const userState = state.steps.userStates[currentUserId];
    if (!userState) return null;
    
    switch (level) {
      case 1: return userState.level1Simulation;
      case 2: return userState.level2Simulation;
      case 3: return userState.level3Simulation;
      default: return null;
    }
  });
  
  // State to track if simulation has been started
  const [simulationStarted, setSimulationStarted] = useState(false);
  
  // State to track if simulation is completed (has chat history)
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  // State for survey responses
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse>({
    'This session improved my confidence in interviewing clients with expressive aphasia.': null,
    'I felt the patient\'s responses were realistic.': null,
    'I was able to navigate the interaction easily.': null,
    'This session was educational and helped me practice useful skills.': null,
    'Open-ended: What was the most helpful part of this session?': ''
  });

  // Get debrief data from server
  const getDebriefData = async () => {
    if (!user?.username) return;
    
    try {
      const debrief = await getDebrief(user.username) as any;
      if (debrief?.answers) {
        // Backend now handles number conversion, so we can use the data directly
        const debriefData = debrief.answers;
        setSurveyResponses(debriefData);
        // Save to Redux store
        dispatch(setLevelSimulation(debriefData));
      }
    } catch (error) {
      // 忽略获取错误
    }
  };

  // Load data from Redux if available, otherwise fetch from server
  useEffect(() => {
    if (levelSimulationFromRedux) {
      // Use data from Redux store
      setSurveyResponses(levelSimulationFromRedux);
    } else {
      // Fetch from server and save to Redux
      getDebriefData();
    }
  }, [user?.username, isCompleted, levelSimulationFromRedux]);

  // Auto-set simulationStarted to true if step is already completed
  useEffect(() => {
    if (isCompleted) {
      setSimulationStarted(true);
      setSimulationCompleted(true);
    }
  }, [isCompleted]);

  const handleStartSimulation = () => {
    // Placeholder URL - replace with actual simulation website URL
    const simulationUrl = `https://simulation-nursetown.com/?userID=${user?.username}&simulationLevel=${level}`;
    window.open(simulationUrl, '_blank');
    // Set simulation as started to change button state
    setSimulationStarted(true);
  };

  const handleCompleteSimulation = async () => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Check if chat history exists in backend
      const chatHistory = await getChatHistory(user.username, level);
      
      // Check if chatHistory exists and has the expected structure
      if (chatHistory && typeof chatHistory === 'object' && 'chatHistory' in chatHistory && chatHistory.chatHistory) {
        // Chat history exists, proceed to survey
        setSimulationCompleted(true);
      } else {
        // No chat history found
        alert('No simulation data found. Please complete the simulation first.');
      }
    } catch (error: any) {
      console.error('Error checking simulation completion:', error);
      alert('No simulation data found. Please complete the simulation first.');
    }
  };

  const handleSubmit = async () => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Submit debrief data to backend
      const submissionData = {
        userID: user.username,
        simulationLevel: level,
        answers: surveyResponses,
      };
      await submitDebrief(submissionData);
      
      // Update the current completed step in Cognito
      await updateUserAttributes({
        userAttributes: {
          'custom:currentCompletedStep': `level-${level}-simulation`
        }
      });
      
      // Save to Redux store after successful submission
      dispatch(setLevelSimulation(surveyResponses));
      dispatch(completeStep(`/level-${level}-simulation`));
      
      // Navigate to the next step
      navigate(nextStep);
    } catch (error) {
      console.error(`Error submitting Level ${level} Simulation:`, error);
    }
  };

  return (
    <div style={{ padding: '50px 20px 20px', minHeight: '100vh', backgroundColor: 'white' }}>
      {!simulationCompleted ? (
        // Show simulation template with dynamic button state
        <SimulationTemplate
          level={level}
          isCompleted={isCompleted}
          onComplete={simulationStarted ? handleCompleteSimulation : handleStartSimulation}
          simulationStarted={simulationStarted}
        >
          <div>
            <h3>Level {level} Simulation: {patientType}</h3>
            <p>{description}</p>
            <p><strong>Patient Type:</strong> {patientType} - {description}</p>
          </div>
        </SimulationTemplate>
      ) : (
        // If simulation is completed, show the survey feedback
        <SurveyContent
          responses={surveyResponses}
          questions={[
            {
              field: 'This session improved my confidence in interviewing clients with expressive aphasia.',
              text: 'This session improved my confidence in interviewing clients with expressive aphasia.'
            },
            {
              field: 'I felt the patient\'s responses were realistic.',
              text: 'I felt the patient\'s responses were realistic.'
            },
            {
              field: 'I was able to navigate the interaction easily.',
              text: 'I was able to navigate the interaction easily.'
            },
            {
              field: 'This session was educational and helped me practice useful skills.',
              text: 'This session was educational and helped me practice useful skills.'
            }
          ]}
          singleOpenEndedQuestion={{
            field: 'Open-ended: What was the most helpful part of this session?',
            text: 'Open-ended: What was the most helpful part of this session?'
          }}
          isCompleted={isCompleted}
          onRatingChange={(field, value) => setSurveyResponses({ ...surveyResponses, [field]: value })}
          onTextChange={(field, value) => setSurveyResponses({ ...surveyResponses, [field]: value })}
          onSubmit={handleSubmit}
          title={`Level ${level} Simulation Feedback`}
          ratingScale={{
            min: 1,
            max: 6,
            leftLabel: 'Strongly disagree',
            rightLabel: 'Strongly agree'
          }}
        />
      )}
    </div>
  );
}
