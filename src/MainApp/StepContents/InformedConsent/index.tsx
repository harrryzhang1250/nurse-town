import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeStep, selectIsStepCompleted } from '../../../reducer';
import type { RootState } from '../../../store';
import InformedConsentContent from './Content';

export default function InformedConsent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) => selectIsStepCompleted('/informed-consent')(state));

  const handleComplete = () => {
    dispatch(completeStep('/informed-consent'));
    navigate('/pre-survey');
  };

  return (
    <InformedConsentContent 
      isCompleted={isCompleted}
      onComplete={handleComplete}
    />
  );
} 