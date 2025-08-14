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
  isCompleted, 
  onComplete, 
  children 
}: SimulationTemplateProps) {
  const containerStyle = {
    width: '100%',
    minHeight: '100%',
    background: 'white',
    padding: '50px 20px 20px',
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

  const getButtonText = (level: number, isCompleted: boolean): string => {
    if (isCompleted) return 'Completed';
    if (level === 3) return 'Complete Simulation';
    return `Next Level`;
  };

  return (
    <Box style={containerStyle}>
      <Paper p="xl" radius="lg" style={paperStyle}>
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
            <Button
              onClick={onComplete}
              disabled={isCompleted}
              size="lg"
              style={getButtonStyle(isCompleted)}
              onMouseEnter={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {getButtonText(level, isCompleted)}
            </Button>
          </Center>
        </Stack>
      </Paper>
    </Box>
  );
}
