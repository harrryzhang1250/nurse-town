import React from 'react';
import { Box, Text, Paper, Stack, Center, Button, Loader } from '@mantine/core';

interface SimulationTemplateProps {
  level: number;
  isCompleted: boolean;
  onComplete: () => void;
  children?: React.ReactNode;
  loading?: boolean;
}

export default function SimulationTemplate({ 
  level, 
  onComplete, 
  children,
  loading = false
}: SimulationTemplateProps) {
  const containerStyle = {
    width: '100%',
    minHeight: '100%',
    background: 'white',
    padding: '30px 20px 20px',
    boxSizing: 'border-box' as const,
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'auto'
  };

  const paperStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  };

  const titleStyle = {
    fontSize: '36px',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 'bold',
    color: '#4f46e5',
    letterSpacing: '1.5px',
    marginBottom: '20px'
  };

  const subtitleStyle = {
    fontSize: '24px',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px'
  };

  const bodyTextStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4b5563',
    marginBottom: '16px'
  };

  const stepStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#059669',
    marginBottom: '8px'
  };

  const stepTextStyle = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '16px'
  };

  const getSimulationGuideButtonText = (level: number): string => {
    if (loading) {
      return 'Checking Simulation...';
    }
    return `Complete Level ${level} Simulation`;
  };


  const handleSimulationGuide = () => {
    if (loading) return;
    // This function will be overridden by the parent component
    onComplete();
  };

  return (
    <Box style={containerStyle}>
      <Paper radius="lg" style={paperStyle}>
        <Stack gap="md">
          {/* Title Section */}
          <Center>
            <Box ta="center">
              <Text style={titleStyle}>
                Level {level} Simulation
              </Text>
              <Text style={subtitleStyle} c="dimmed">
                Simulation Module {level}
              </Text>
            </Box>
          </Center>

          {/* Content Section */}
          <Box>
            {children || (
              <Text style={bodyTextStyle}>
                This is Level {level} Simulation content. Customize this section by passing children components.
              </Text>
            )}
          </Box>

          {/* Step Information */}
          <Box style={{ marginBottom: '30px' }}>
            <Text style={stepStyle}>Step 1: Launch and Login to the Application</Text>
            <Text style={stepTextStyle}>
              Open the application you downloaded earlier on your computer. 
              Use your User Study Portal username and password to log in to the application.
            </Text>
            
            <Text style={stepStyle}>Step 2: Complete Simulation and Sign Out</Text>
            <Text style={stepTextStyle}>
              Complete all required interactions in the simulation. After finishing, remember to sign out 
              from the application, then return to this page and click the "Complete Simulation" 
              button to verify your progress and proceed to the feedback survey.
            </Text>
          </Box>

          {/* Button Section */}
          <Center>
            <Stack gap="md" align="center" mt="xl">
              {/* Simulation Guide Button */}
              <Button
                onClick={handleSimulationGuide}
                size="lg"
                disabled={loading}
                loading={loading}
                style={{
                  backgroundColor: '#cd853f',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '16px 40px',
                  transition: 'all 0.3s ease',
                  minWidth: '320px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: 1,
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#cd853f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 140, 118, 0.28)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#cd853f';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                  }
                }}
              >
                {loading && <Loader size="sm" color="white" style={{ marginRight: '8px' }} />}
                {getSimulationGuideButtonText(level)}
              </Button>
            </Stack>
          </Center>

        </Stack>
      </Paper>
    </Box>
  );
}
