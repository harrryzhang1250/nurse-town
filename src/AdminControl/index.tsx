import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import ResponsePage from './ResponsePage';
import * as client from './client';

export interface UserRegistration {
  username: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  username?: string;
  password?: string;
}

export default function AdminControl() {
  const [formData, setFormData] = useState<UserRegistration>({
    username: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState<RegistrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      username: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submissionData = {
        username: formData.username
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
    const usernameValid = formData.username.trim() !== '';
    return usernameValid;
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
      onUsernameChange={handleUsernameChange}
      onSubmit={handleSubmit}
    />
  );
}
