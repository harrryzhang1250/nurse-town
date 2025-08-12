import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import SignUpStudyContent from './Content';

export default function SignUpStudy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/sign-up-study')(state));

  const handleComplete = () => {
    dispatch(completeStep('/sign-up-study'));
    navigate('/post-survey');
  };

  return (
    <SignUpStudyContent 
      isCompleted={isCompleted}
      onComplete={handleComplete}
    />
  );
} 