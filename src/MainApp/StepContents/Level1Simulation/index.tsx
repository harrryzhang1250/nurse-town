import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SimulationTemplate from '../../../shared/SimulationTemplate';
import { updateUserAttributes } from 'aws-amplify/auth';

export default function Level1Simulation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/level-1-simulation')(state));

  const handleComplete = async () => {
    await updateUserAttributes({
      userAttributes: {
        'custom:currentCompletedStep': 'level-1-simulation'
      }
    });
    dispatch(completeStep('/level-1-simulation'));
    navigate('/level-2-simulation');
  };

  return (
    <SimulationTemplate
      level={1}
      isCompleted={isCompleted}
      onComplete={handleComplete}
    >
      <div>
        <h3>Level 1 Simulation: Cooperative Patient</h3>
        <p>This is the first level of the simulation featuring a cooperative patient. Here you will learn the basic concepts and complete initial training exercises with a patient who is willing and able to communicate effectively.</p>
        <p>Key learning objectives for Level 1:</p>
        <ul>
          <li>Basic patient assessment with a cooperative patient</li>
          <li>Fundamental nursing procedures and communication</li>
          <li>Safety protocols and patient comfort</li>
          <li>Building confidence in patient interaction</li>
          <li>Establishing therapeutic rapport</li>
        </ul>
        <p><strong>Patient Type:</strong> Cooperative Patient - This patient is responsive, follows instructions well, and communicates clearly, making them ideal for learning basic assessment and communication skills.</p>
      </div>
    </SimulationTemplate>
  );
}
