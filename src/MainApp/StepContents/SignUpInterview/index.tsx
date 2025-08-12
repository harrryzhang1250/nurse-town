import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SignUpInterviewContent from './Content';

export default function SignUpInterview() {
  const dispatch = useDispatch();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/sign-up-interview')(state));

  const handleComplete = () => {
    dispatch(completeStep('/sign-up-interview'));
    // This is the final step, so we can stay here or navigate to a completion page
  };

  return (
    <SignUpInterviewContent 
      isCompleted={isCompleted}
      onComplete={handleComplete}
    />
  );
} 