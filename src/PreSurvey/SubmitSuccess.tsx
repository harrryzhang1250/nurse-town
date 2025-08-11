import React from 'react';
import {
  Container,
  Paper,
  Text,
  Stack,
  Box,
  Center
} from '@mantine/core';

interface SubmitSuccessProps {
  onBackToSurvey?: () => void;
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = () => {
  return (
    <Box
      style={{
        minHeight: '100%',
        width: '100vw',
        background: 'white',
        padding: '40px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
        <Paper
          p="xl"
          radius="lg"
          style={{
            backgroundColor: 'white',
            border: 'none'
          }}
        >
          <Center>
            <Stack gap="40px" align="center">
              {/* Success Icon */}
              <Box
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{
                    fontSize: '60px',
                    color: 'white'
                  }}
                >
                  ✓
                </Text>
              </Box>

              {/* Success Title */}
              <Text
                fw="bold"
                style={{
                  fontSize: '32px',
                  color: '#2e7d32',
                  textAlign: 'center'
                }}
              >
                Survey Submitted Successfully!
              </Text>

              {/* Additional Info */}
              <Box
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #4caf50'
                }}
              >
                <Text
                  style={{
                    fontSize: '16px',
                    color: '#495057',
                    textAlign: 'left'
                  }}
                >
                  <strong>Next Steps:</strong> Please wait for further instructions 
                  from your instructor to begin the simulation experience.
                </Text>
              </Box>

            </Stack>
          </Center>
        </Paper>
      </Container>
    </Box>
  );
};

export default SubmitSuccess; 