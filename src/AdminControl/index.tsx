import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import ResponsePage from './ResponsePage';
import * as client from './client';

export interface UserRegistration {
  email: string;
  role: string;
  customRole: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export default function AdminControl() {
  const [formData, setFormData] = useState<UserRegistration>({
    email: '',
    role: '',
    customRole: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState<RegistrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      email: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      customRole: value !== 'other' ? '' : prev.customRole
    }));
  };

  const handleCustomRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      customRole: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submissionData = {
        email: formData.email,
        role: formData.role === 'other' ? formData.customRole : formData.role
      };

      console.log('Submitting registration:', submissionData);
      
      const result = await client.registerUser(submissionData);
      console.log('Registration response:', result);
      
      setResponse(result);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      // This should rarely happen now since client.registerUser handles most errors
      setResponse({
        success: false,
        message: 'Unexpected error occurred. Please try again.'
      });
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
    setResponse(null);
  };

  const isFormValid = () => {
    const emailValid = formData.email.trim() !== '' && formData.email.includes('@');
    const roleValid = formData.role !== '';
    const customRoleValid = formData.role !== 'other' || formData.customRole.trim() !== '';
    
    return emailValid && roleValid && customRoleValid;
  };

  const formValid = isFormValid();

  if (isSubmitted && response) {
    return (
      <ResponsePage 
        response={response} 
        onBackToForm={handleBackToForm}
      />
    );
  }

  return (
    <RegistrationForm
      formData={formData}
      formValid={formValid}
      isLoading={isLoading}
      onEmailChange={handleEmailChange}
      onRoleChange={handleRoleChange}
      onCustomRoleChange={handleCustomRoleChange}
      onSubmit={handleSubmit}
    />
  );
}
