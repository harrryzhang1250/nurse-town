import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SimulationTemplate from '../../../shared/SimulationTemplate';
import { updateUserAttributes } from 'aws-amplify/auth';

export default function Level2Simulation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/level-2-simulation')(state));

  const handleComplete = async () => {
    await updateUserAttributes({
      userAttributes: {
        'custom:currentCompletedStep': 'level-2-simulation'
      }
    });
    dispatch(completeStep('/level-2-simulation'));
    navigate('/level-3-simulation');
  };

  return (
    <SimulationTemplate
      level={2}
      isCompleted={isCompleted}
      onComplete={handleComplete}
    >
      <div>
        <h3>Level 2 Simulation: Cooperative Patient</h3>
        <p>This is the intermediate level of the simulation featuring a cooperative patient with more complex scenarios. Here you will build upon your Level 1 skills and tackle more challenging situations while working with a patient who remains cooperative.</p>
        <p>Key learning objectives for Level 2:</p>
        <ul>
          <li>Advanced patient assessment with cooperative patient</li>
          <li>Complex clinical decision making</li>
          <li>Team communication and coordination</li>
          <li>Emergency response protocols</li>
          <li>Advanced therapeutic techniques</li>
          <li>Patient education and counseling</li>
        </ul>
        <p><strong>Patient Type:</strong> Cooperative Patient - This patient maintains their cooperative nature but presents with more complex health conditions, requiring advanced assessment and intervention skills while maintaining clear communication.</p>
      </div>
    </SimulationTemplate>
  );
}
