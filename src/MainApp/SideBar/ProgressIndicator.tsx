import React from 'react';
import { Box, Text, Progress } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectProgressPercentage, selectCompletedSteps } from '../../reducer';
import type { RootState } from '../../store';

const ProgressIndicator: React.FC = () => {
  const progressPercentage = useSelector((state: RootState) => selectProgressPercentage(state));
  const completedSteps = useSelector((state: RootState) => selectCompletedSteps(state));

  return (
    <Box
      style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '10px 0'
      }}
    >
      <Text size="sm" fw={600} mb="xs">
        Overall Progress: {progressPercentage}%
      </Text>
      <Progress 
        value={progressPercentage} 
        color="#4f46e5" 
        size="md" 
        radius="md"
        mb="xs"
      />
      <Text size="xs" c="dimmed">
        {completedSteps.length} of 5 steps completed
      </Text>
    </Box>
  );
};

export default ProgressIndicator; 