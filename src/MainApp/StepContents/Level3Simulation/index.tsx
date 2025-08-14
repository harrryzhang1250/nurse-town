import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SimulationTemplate from '../../../shared/SimulationTemplate';
import { updateUserAttributes } from 'aws-amplify/auth';

export default function Level3Simulation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/level-3-simulation')(state));

  const handleComplete = async () => {
    await updateUserAttributes({
      userAttributes: {
        'custom:currentCompletedStep': 'level-3-simulation'
      }
    });
    dispatch(completeStep('/level-3-simulation'));
    navigate('/post-survey');
  };

  return (
    <SimulationTemplate
      level={3}
      isCompleted={isCompleted}
      onComplete={handleComplete}
    >
      <div>
        <h3>Level 3 Simulation: Challenging Patient</h3>
        <p>This is the advanced level of the simulation featuring a challenging patient. Here you will master complex clinical scenarios and demonstrate proficiency in handling difficult patient situations while maintaining professional composure.</p>
        <p>Key learning objectives for Level 3:</p>
        <ul>
          <li>Master-level clinical decision making with challenging patients</li>
          <li>Complex patient management under pressure</li>
          <li>Leadership in difficult clinical situations</li>
          <li>Advanced emergency protocols</li>
          <li>Quality improvement initiatives</li>
          <li>Conflict resolution and de-escalation</li>
          <li>Professional boundary setting</li>
        </ul>
        <p><strong>Patient Type:</strong> Challenging Patient - This patient may be uncooperative, have complex behavioral issues, or present with difficult-to-manage conditions. They require advanced communication skills, patience, and professional expertise to provide effective care.</p>
      </div>
    </SimulationTemplate>
  );
}
