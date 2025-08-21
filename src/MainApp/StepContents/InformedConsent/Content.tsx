import { Box, Text, Button, Paper, Stack, Center } from '@mantine/core';

interface InformedConsentContentProps {
  isCompleted: boolean;
  onComplete: () => void;
}

export default function InformedConsentContent({ isCompleted, onComplete }: InformedConsentContentProps) {
  const containerStyle = {
    marginTop: '2.5rem',
    minHeight: '100vh',
    background: 'white',
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  const paperStyle = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const bodyTextStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: '16px',
    textAlign: 'left' as const
  };

  const getButtonStyle = (isCompleted: boolean) => ({
    backgroundColor: isCompleted ? '#9ca3af' : '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    padding: '16px 60px',
    transition: 'all 0.3s ease',
    minWidth: '400px',
    color: 'white',
    cursor: isCompleted ? 'default' : 'pointer',
    opacity: isCompleted ? 0.8 : 1,
    marginTop: '40px'
  });

  return (
    <Box style={containerStyle}>
      <Paper p="xl" radius="lg" style={paperStyle}>
        <Stack gap="lg">
          <Center style={{ marginBottom: '40px' }}>
            <Box ta="center">
              <Box>
                <Text
                  fw="bold"
                  c='#4f46e5'
                  mb="md"
                  style={{
                    fontSize: '36px',
                    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                    letterSpacing: '1.5px'
                  }}
                >
                  Informed Consent
                </Text>
              </Box>
            </Box>
          </Center>
          
          <Text style={bodyTextStyle}>
            You are invited to participate in a research study conducted by Ilmi Yoon and the student team at Northeastern University. The purpose of this study is to evaluate the effectiveness of AI-driven Virtual Standardized Patients developed to support simulation-based training for nursing students. Your participation will help shape the design and functionality of this tool to enhance nursing education.
          </Text>
          
          <Text style={bodyTextStyle}>
            Before you decide whether to participate, it is important to understand the study, what is expected of you, and any potential risks and benefits.
          </Text>
        
          
          <Text style={bodyTextStyle}>
            This research aims to evaluate the impact of AI-driven Virtual Standardized Patients (VSPs) on SLP students' development of clinical reasoning, interpersonal communication skills, confidence, and perceived readiness for real-world clinical practice. The study will utilize qualitative interviews and user feedback to evaluate the usability, perceived realism, and ethical considerations.
          </Text>
          
          <Center>
            <Button
              onClick={onComplete}
              disabled={isCompleted}
              size="lg"
              style={getButtonStyle(isCompleted)}
              styles={{
                root: {
                  minWidth: '400px',
                  width: '400px',
                  maxWidth: '400px'
                }
              }}
              onMouseEnter={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.backgroundColor = '#cd853f';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 140, 118, 0.28)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }
              }}
            >
              {isCompleted ? 'Completed' : 'I Agree and Consent'}
            </Button>
          </Center>
        </Stack>
      </Paper>
    </Box>
  );
} 