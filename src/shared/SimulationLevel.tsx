import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { updateUserAttributes } from 'aws-amplify/auth';
import SimulationTemplate from './SimulationTemplate';
import { completeStep, selectIsStepCompleted, setSimulationCompleted, selectSimulationCompleted} from '../reducer';
import { getDebrief, getSimulationData, submitDebrief } from './simulationClient';
import type { RootState } from '../store';
import { SelfReflection } from './SelfReflection';
import EvaluationResult from './EvaluationResult';

interface SimulationLevelProps {
  level: number;
  setLevelDebrief: (data: any[] | {
    checklistItems: any[];
    midSurveyResponses: any;
  }) => { type: string; payload: any };
  setLevelSimulationData: (data: any) => { type: string; payload: any };
  selectSimulationData: (state: RootState) => any;
  nextStep: string;
  patientType: string;
  description: string;
}

export default function SimulationLevel({
  level,
  setLevelDebrief,
  setLevelSimulationData,
  selectSimulationData,
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

  // Get simulation completed state from Redux for current level
  const simulationCompleted = useSelector((state: RootState) => selectSimulationCompleted(level)(state));
  
  // Get simulation data based on level
  const simulationData = useSelector((state: RootState) => {
    const currentUserId = state.steps.currentUserId;
    if (!currentUserId || !state.steps.userStates[currentUserId]) return null;
    
    switch (level) {
      case 1: return state.steps.userStates[currentUserId].level1SimulationData;
      case 2: return state.steps.userStates[currentUserId].level2SimulationData;
      case 3: return state.steps.userStates[currentUserId].level3SimulationData;
      default: return null;
    }
  });

  // State for checklist data
  const [checklistData, setChecklistData] = useState<any[]>([]);
  const [midSurveyResponses, setMidSurveyResponses] = useState({
    'This session improved my confidence in interviewing clients with expressive aphasia': null as number | null,
    'I felt the patient\'s responses were realistic': null as number | null,
    'I was able to navigate the interaction easily': null as number | null,
    'This session was educational and helped me practice useful skills': null as number | null,
    'Which behaviors were most challenging for you to respond to, and why?': '',
    'What communication strategies seemed to help the patient most?': '',
    'If you could redo one moment in the simulation, what would you change?': '',
    'How will you apply what you learned in a real clinical setting?': '',
    'What was the most helpful part of this session?': ''
  });
  // State for evaluation data
  // const [evaluationData, setEvaluationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedData = useRef(false);

  // Get debrief data from server
  const getDebriefData = async () => {
    if (!user?.username) return;
    const debrief = await getDebrief(user.username, level) as any;
      if (debrief?.answers) {
        setChecklistData(debrief.answers.checklistItems);
        setMidSurveyResponses(debrief.answers.midSurveyResponses);
        // Only dispatch if we haven't already stored this data
        if (!hasFetchedData.current) {
          dispatch(setLevelDebrief(debrief.answers));
        }
      }
  };

  // get simulation data from server
  const fetchSimulationData = async () => {
    if (!user?.username) return;
    const simulationData = await getSimulationData(user.username, level) as any;
    if (simulationData?.report) {
      dispatch(setLevelSimulationData(simulationData));
    }
  };

  // Fetch data from server only once when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      if (user?.username && !hasFetchedData.current) {
        hasFetchedData.current = true;
        await getDebriefData();
        // Only fetch simulation data if we don't already have evaluationData
        if (!simulationData) {
          await fetchSimulationData();
        }
      }
    };
    
    fetchInitialData();
  }, [user?.username, level, simulationData, dispatch]);

  // Auto-set simulationCompleted to true if step is already completed
  useEffect(() => {
    if (isCompleted) {
      // Dispatch the action for current level
      dispatch(setSimulationCompleted({ level, completed: true }));
    }
  }, [isCompleted, level, dispatch]);

  const handleCompleteSimulation = async () => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Check if simulation data exists in backend
      const simulationData = await getSimulationData(user.username, level);
      // Set evaluation data if report exists
      if (simulationData && (simulationData as any).report) {
        dispatch(setLevelSimulationData(simulationData));
      }
      
      // Store simulation data in Redux
      dispatch(setLevelSimulationData(simulationData));
      dispatch(setSimulationCompleted({ level, completed: true }));
    } catch (error) {
      alert('No simulation data found. Please complete the simulation first.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfReflectionSubmit = async (data: any) => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Handle new data format with both checklist and mid-survey responses
      const checklistData = data.checklistItems;
      const midSurveyData = data.midSurveyResponses;

      // Submit checklist data and mid-survey data to backend
      const submissionData = {
        userID: user.username,
        simulationLevel: level,
        answers: {
          checklistItems: checklistData,
          midSurveyResponses: midSurveyData  // 使用从SelfReflection传过来的数据
        }
      };
      await submitDebrief(submissionData);
      
      // Save to Redux store after successful submission
      // Store both checklist and mid-survey data in Redux
      const combinedData = {
        checklistItems: checklistData,
        midSurveyResponses: midSurveyData  // 使用从SelfReflection传过来的数据
      };
      
      // Use the setLevelSimulation prop passed from the parent component
      dispatch(setLevelDebrief(combinedData));
      
      // Update the current completed step in Cognito
      await updateUserAttributes({
        userAttributes: {
          'custom:currentCompletedStep': `level-${level}-simulation`
        }
      });
      
      // Complete the step and navigate to next step
      dispatch(completeStep(`/level-${level}-simulation`));
      
      // Navigate to the next step
      navigate(nextStep);
    } catch (error) {
      console.error(`Error submitting Level ${level} Simulation Checklist:`, error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      {!simulationCompleted ? (
        // Show simulation template
        <SimulationTemplate
          level={level}
          isCompleted={isCompleted}
          onComplete={handleCompleteSimulation}
          loading={isLoading}
        >
          <div>
            <h3>Level {level} Simulation: {patientType}</h3>
            <p>{description}</p>
            <p><strong>Patient Type:</strong> {patientType} - {description}</p>
          </div>
        </SimulationTemplate>
      ) : (
        <>
        <EvaluationResult evaluationData={simulationData?.report || null} />
        <SelfReflection
          isCompleted={isCompleted}
          initialData={{ checklistItems: checklistData, midSurveyResponses: midSurveyResponses }}
          onSubmit={handleSelfReflectionSubmit}
        />
        </>
      )}
    </div>
  );
}
