import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { Box, Text, Paper, Stack, Center, Button, Title } from '@mantine/core';
import { IconCircleCheck, IconLogout, IconHeart } from '@tabler/icons-react';

export default function CompletionPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to home or login page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const containerStyle = {
    width: '100%',
    minHeight: '100%',
    background: 'white',
    padding: '50px 20px 20px',
    boxSizing: 'border-box' as const,
    height: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'auto'
  };

  const paperStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    background: 'white',
    backdropFilter: 'blur(10px)'
  };

  const titleStyle = {
    fontSize: '48px',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 'bold',
    color: '#4f46e5',
    letterSpacing: '1.5px',
    marginBottom: '10px',
    textAlign: 'center' as const
  };

  const subtitleStyle = {
    fontSize: '24px',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '16px',
    textAlign: 'center' as const
  };

  const bodyTextStyle = {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#4b5563',
    marginBottom: '10px',
    textAlign: 'center' as const
  };

  const buttonStyle = {
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    padding: '16px 40px',
    transition: 'all 0.3s ease',
    minWidth: '200px',
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <Box style={containerStyle}>
      <Paper p="xl" radius="lg" style={paperStyle}>
        <Stack gap="xl" align="center">
          {/* Success Icon */}
          <Center>
            <IconCircleCheck 
              size={80} 
              color="#10b981" 
              style={{ marginBottom: '20px' }}
            />
          </Center>

          {/* Title */}
          <Title style={titleStyle}>
            🎉 Study Completed! 🎉
          </Title>

          {/* Subtitle */}
          <Text style={subtitleStyle} c="dimmed">
            Thank You for Your Participation
          </Text>

          {/* Main Content */}
          <Box ta="center">
            <Text style={bodyTextStyle}>
              Congratulations! You have successfully completed all levels of the nursing simulation study.
            </Text>
            
            <Text style={bodyTextStyle}>
              Your participation has contributed valuable data to our research on virtual standardized patient training.
              We appreciate the time and effort you've dedicated to this study.
            </Text>

            <Text style={bodyTextStyle}>
              <IconHeart size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Thank you for being part of this important research initiative!
            </Text>
          </Box>

          {/* Action Buttons */}
          <Stack gap="md" align="center">
            <Button
              onClick={handleLogout}
              size="lg"
              style={buttonStyle}
              leftSection={<IconLogout size={20} />}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Sign Out & Exit
            </Button>

            <Text size="sm" c="dimmed" ta="center">
              You can now safely close this browser tab or sign out to return to the login page.
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
