import React from 'react';
import {
  Container,
  Paper,
  Text,
  Button,
  TextInput,
  Select,
  Stack,
  Box,
  Center,
  Loader
} from '@mantine/core';
import type { UserRegistration } from './index';

interface RegistrationFormProps {
  formData: UserRegistration;
  formValid: boolean;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onCustomRoleChange: (value: string) => void;
  onSubmit: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  formValid,
  isLoading,
  onEmailChange,
  onRoleChange,
  onCustomRoleChange,
  onSubmit
}) => {
  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'instructor', label: 'Instructor' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' }
  ];

  if (isLoading) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <Center>
          <Stack align="center" gap="lg">
            <Loader size="xl" color="#d2691e" />
            <Text size="lg" c="#666">
              Registering user...
            </Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <Container size="sm">
        <Paper
          p="xl"
          radius="lg"
          shadow="xl"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          {/* Title */}
          <Center mb="xl">
            <Text
              fw="bold"
              c="#d2691e"
              style={{
                fontSize: '28px',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                letterSpacing: '1px'
              }}
            >
              User Registration
            </Text>
          </Center>

          <Stack gap="lg">
            {/* Email Input */}
            <Box>
              <Text
                fw={600}
                c="#111"
                mb="sm"
                style={{
                  fontSize: '16px',
                  textAlign: 'left'
                }}
              >
                Email Address*
              </Text>
              <TextInput
                value={formData.email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="Enter email address"
                size="lg"
                type="email"
                style={{
                  width: '100%'
                }}
                styles={{
                  input: {
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#111',
                    padding: '12px 16px'
                  }
                }}
              />
            </Box>

            {/* Role Selection */}
            <Box>
              <Text
                fw={600}
                c="#111"
                mb="sm"
                style={{
                  fontSize: '16px',
                  textAlign: 'left'
                }}
              >
                User Role*
              </Text>
              <Select
                value={formData.role}
                onChange={(value) => onRoleChange(value || '')}
                placeholder="Select a role"
                data={roleOptions}
                size="lg"
                style={{
                  width: '100%'
                }}
                styles={{
                  input: {
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#111',
                    padding: '12px 16px'
                  }
                }}
              />
            </Box>

            {/* Custom Role Input (conditional) */}
            {formData.role === 'other' && (
              <Box>
                <Text
                  fw={600}
                  c="#111"
                  mb="sm"
                  style={{
                    fontSize: '16px',
                    textAlign: 'left'
                  }}
                >
                  Custom Role*
                </Text>
                <TextInput
                  value={formData.customRole}
                  onChange={(e) => onCustomRoleChange(e.target.value)}
                  placeholder="Enter custom role"
                  size="lg"
                  style={{
                    width: '100%'
                  }}
                  styles={{
                    input: {
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: '#111',
                      padding: '12px 16px'
                    }
                  }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Center mt="xl">
              <Button
                onClick={onSubmit}
                size="lg"
                disabled={!formValid}
                style={{
                  backgroundColor: formValid ? '#d2691e' : '#f4a261',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '14px 40px',
                  transition: 'all 0.3s ease',
                  minWidth: '200px',
                  color: 'white',
                  cursor: formValid ? 'pointer' : 'not-allowed',
                  opacity: formValid ? 1 : 0.7
                }}
                onMouseEnter={(e) => {
                  if (formValid) {
                    e.currentTarget.style.backgroundColor = '#cd853f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formValid) {
                    e.currentTarget.style.backgroundColor = '#d2691e';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Register User
              </Button>
            </Center>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationForm; 