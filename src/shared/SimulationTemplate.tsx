import React from 'react';
import { Box, Text, Paper, Stack, Center, Button } from '@mantine/core';

interface SimulationTemplateProps {
  level: number;
  isCompleted: boolean;
  onComplete: () => void;
  children?: React.ReactNode;
}

export default function SimulationTemplate({ 
  level, 
  onComplete, 
  children 
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
    marginBottom: '16px'
  };

  const bodyTextStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4b5563',
    marginBottom: '16px'
  };

  const getSimulationGuideButtonStyle = () => ({
    backgroundColor: '#cd853f',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 40px',
    transition: 'all 0.3s ease',
    minWidth: '300px',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '20px'
  });

  const getSimulationGuideButtonText = (level: number): string => {
    return `Start Level ${level} Simulation`;
  };

  const handleSimulationGuide = () => {
    // This function will be overridden by the parent component
    onComplete();
  };

  return (
    <Box style={containerStyle}>
      <Paper radius="lg" style={paperStyle}>
        <Stack gap="lg">
          {/* Title Section */}
          <Center style={{ marginBottom: '40px' }}>
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

          

          {/* Button Section */}
          <Center>
            <Stack gap="md" align="center" mt="xl">
              {/* Simulation Guide Button */}
              <Button
                onClick={handleSimulationGuide}
                size="lg"
                style={getSimulationGuideButtonStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#cd853f';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#cd853f';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {getSimulationGuideButtonText(level)}
              </Button>
            </Stack>
          </Center>

        </Stack>
      </Paper>
    </Box>
  );
}
