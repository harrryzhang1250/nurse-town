import React from 'react';
import {
  Container,
  Paper,
  Text,
  Button,
  Stack,
  Box,
  Center
} from '@mantine/core';
import type { RegistrationResponse } from './index';

interface ResponsePageProps {
  response: RegistrationResponse;
  onBackToForm: () => void;
}

const ResponsePage: React.FC<ResponsePageProps> = ({
  response,
  onBackToForm
}) => {
  const isSuccess = response.success;

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
          <Center>
            <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
              {/* Status Icon */}
              <Box
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: isSuccess ? '#28a745' : '#dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: 'white'
                }}
              >
                {isSuccess ? '✓' : '✗'}
              </Box>

              {/* Title */}
              <Text
                fw="bold"
                style={{
                  fontSize: '24px',
                  color: isSuccess ? '#28a745' : '#dc3545',
                  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
                }}
              >
                {isSuccess ? 'Registration Successful!' : 'Registration Failed'}
              </Text>

              {/* Message */}
              <Text
                size="lg"
                c="#666"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  maxWidth: '400px'
                }}
              >
                {response.message}
              </Text>

              {/* User ID (if success and provided) */}
              {isSuccess && response.userId && (
                <Box
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '100%',
                    maxWidth: '400px'
                  }}
                >
                  <Text
                    fw={600}
                    c="#111"
                    mb="xs"
                    style={{ fontSize: '14px' }}
                  >
                    User ID:
                  </Text>
                  <Text
                    style={{
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      color: '#495057',
                      wordBreak: 'break-all'
                    }}
                  >
                    {response.userId}
                  </Text>
                </Box>
              )}

              {/* Additional Information */}
              {isSuccess ? (
                <Box style={{ textAlign: 'center' }}>
                  <Text size="sm" c="#666" mb="sm">
                    The user has been successfully registered in the system.
                  </Text>
                  <Text size="sm" c="#666">
                    You can now register another user or return to the admin panel.
                  </Text>
                </Box>
              ) : (
                <Box style={{ textAlign: 'center' }}>
                  <Text size="sm" c="#666" mb="sm">
                    Please check the information and try again.
                  </Text>
                  <Text size="sm" c="#666">
                    If the problem persists, contact technical support.
                  </Text>
                </Box>
              )}

              {/* Action Buttons */}
              <Stack gap="md" style={{ width: '100%', maxWidth: '300px' }}>
                <Button
                  onClick={onBackToForm}
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: '#d2691e',
                    color: '#d2691e',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '12px 24px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d2691e';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#d2691e';
                  }}
                >
                  {isSuccess ? 'Register Another User' : 'Try Again'}
                </Button>
                
              </Stack>
            </Stack>
          </Center>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResponsePage; 