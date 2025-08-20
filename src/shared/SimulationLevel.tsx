import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { updateUserAttributes } from 'aws-amplify/auth';
import SimulationTemplate from './SimulationTemplate';
import { completeStep, selectIsStepCompleted, setSimulationCompleted, selectSimulationCompleted, type ChecklistItem } from '../reducer';
import type { RootState } from '../store';
import { SimulationChecklist } from './SimulationChecklist';
import { getSimulationData } from './simulationClient';

interface SimulationLevelProps {
  level: number;
  setLevelSimulation: (data: ChecklistItem[]) => { type: string; payload: ChecklistItem[] };
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
  
  // Get simulation completed state from Redux for current level
  const simulationCompleted = useSelector((state: RootState) => selectSimulationCompleted(level)(state));

  // State for checklist data
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);

  // Get debrief data from server
  const getDebriefData = async () => {
    if (!user?.username) return;
    
    try {
      const debrief = await getDebrief(user.username) as any;
      if (debrief?.answers) {
        setChecklistData(debrief.answers);
        // Save to Redux store
        dispatch(setLevelSimulation(debrief.answers));
      }
    } catch (error) {
      // Ignore fetch errors
    }
  };

  // Load data from Redux if available, otherwise fetch from server
  useEffect(() => {
    if (levelSimulationFromRedux && Array.isArray(levelSimulationFromRedux)) {
      // Use data from Redux store
      setChecklistData(levelSimulationFromRedux);
    } else {
      // Fetch from server and save to Redux
      getDebriefData();
    }
  }, [user?.username, isCompleted, levelSimulationFromRedux]);

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

    try {
      // Check if simulation data exists in backend
      await getSimulationData(user.username, level);
      dispatch(setSimulationCompleted({ level, completed: true }));
    } catch (error) {
      alert('No simulation data found. Please complete the simulation first.');
    }
  };

  const handleChecklistSubmit = async (checklistItems: ChecklistItem[]) => {
    if (!user?.username) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Submit checklist data to backend
      const submissionData = {
        userID: user.username,
        simulationLevel: level,
        answers: checklistItems,
      };
      await submitDebrief(submissionData);
      
      // Update the current completed step in Cognito
      await updateUserAttributes({
        userAttributes: {
          'custom:currentCompletedStep': `level-${level}-simulation`
        }
      });
      
      // Save to Redux store after successful submission
      dispatch(setLevelSimulation(checklistItems));
      dispatch(completeStep(`/level-${level}-simulation`));
      
      // Navigate to the next step
      navigate(nextStep);
    } catch (error) {
      console.error(`Error submitting Level ${level} Simulation Checklist:`, error);
    }
  };

  return (
    <div style={{ padding: '50px 20px 20px', minHeight: '100vh', backgroundColor: 'white' }}>
      {!simulationCompleted ? (
        // Show simulation template
        <SimulationTemplate
          level={level}
          isCompleted={isCompleted}
          onComplete={handleCompleteSimulation}
        >
          <div>
            <h3>Level {level} Simulation: {patientType}</h3>
            <p>{description}</p>
            <p><strong>Patient Type:</strong> {patientType} - {description}</p>
          </div>
        </SimulationTemplate>
      ) : (
        <SimulationChecklist
          isCompleted={isCompleted}
          initialData={checklistData}
          onSubmit={handleChecklistSubmit}
        />
      )}
    </div>
  );
}
