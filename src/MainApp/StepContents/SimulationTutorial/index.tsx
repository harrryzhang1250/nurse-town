import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SimulationTutorialContent from './Content';
import { updateUserAttributes } from 'aws-amplify/auth';

export default function SimulationTutorial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/simulation-tutorial')(state));

  const handleComplete = async () => {
    // Update the current completed step in Cognito
    await updateUserAttributes({
      userAttributes: {
        'custom:currentCompletedStep': 'simulation-tutorial'
      }
    });
    dispatch(completeStep('/simulation-tutorial'));
    navigate('/level-1-simulation');
  };

  return (
    <SimulationTutorialContent 
      isCompleted={isCompleted}
      onComplete={handleComplete}
    />
  );
}
