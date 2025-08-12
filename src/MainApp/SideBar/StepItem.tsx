import React from 'react';
import { Box, Text } from '@mantine/core';

interface StepItemProps {
  step: {
    name: string;
    path: string;
  };
  isCompleted: boolean;
  isClickable: boolean;
  isActive: boolean;
  onClick: () => void;
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  isCompleted,
  isClickable,
  isActive,
  onClick
}) => {
  let backgroundColor = 'transparent';
  let color = '#000';
  let fontWeight = 400;
  let opacity = 1;
  let cursor = 'pointer';

  if (isActive) {
    backgroundColor = '#4f46e5';
    color = 'white';
    fontWeight = 700;
  } else if (isCompleted) {
    backgroundColor = '#10b981';
    color = 'white';
  } else if (!isClickable) {
    color = 'gray';
    cursor = 'not-allowed';
    opacity = 0.5;
  }

  return (
    <Box
      style={{
        padding: '10px',
        borderRadius: '5px',
        backgroundColor,
        color,
        fontWeight,
        opacity,
        cursor,
        transition: 'all 0.2s ease'
      }}
      onClick={onClick}
    >
      <Text
        size="sm"
        style={{
          color: 'inherit',
          fontWeight: 'inherit'
        }}
      >
        {step.name}
      </Text>
    </Box>
  );
};

export default StepItem; 