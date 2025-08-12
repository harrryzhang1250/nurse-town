import { Box, Text, Button } from '@mantine/core';
import PreSurvey from './PreSurvey';

interface StepContentProps {
  step: string;
  isCompleted: boolean;
  isAllComplete: boolean;
  onComplete: () => void;
}

function StepContent({ step, isCompleted, isAllComplete, onComplete }: StepContentProps) {
  if (isAllComplete) {
    return (
      <Box
        style={{
          marginLeft: '250px', // Account for sidebar width
          padding: '40px',
          paddingTop: '90px', // Account for TopBar height + extra spacing
          minHeight: '100vh',
          width: 'calc(100vw - 250px)', // Full width minus sidebar
          background: 'white',
          boxSizing: 'border-box'
        }}
      >
        <Text size="xl" fw={600} mb="md">
          🎉 Thank You!
        </Text>
        <Text size="md">
          You have completed all steps in the user study process.
        </Text>
      </Box>
    );
  }

  // Special handling for Pre-Survey step
  if (step === "Pre-Survey") {
    return (
      <Box
        style={{
          marginLeft: '250px', // Account for sidebar width
          padding: '40px',
          paddingTop: '90px', // Account for TopBar height + extra spacing
          minHeight: '100vh',
          width: 'calc(100vw - 250px)', // Full width minus sidebar
          background: 'white',
          boxSizing: 'border-box'
        }}
      >
        <PreSurvey />
      </Box>
    );
  }

  return (
    <Box
      style={{
        marginLeft: '250px', // Account for sidebar width
        padding: '40px',
        paddingTop: '90px', // Account for TopBar height + extra spacing
        minHeight: '100vh',
        width: 'calc(100vw - 250px)', // Full width minus sidebar
        background: 'white',
        boxSizing: 'border-box'
      }}
    >
      <Text size="xl" fw={600} mb="md">
        {step}
      </Text>
      <Text size="md" mb="xl">
        This is placeholder content for the "{step}" step of the user study.
      </Text>
      {isCompleted ? (
        <Text size="md" c="green" fw={700}>
          ✅ This step is completed.
        </Text>
      ) : (
        <Button
          onClick={onComplete}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Complete Step
        </Button>
      )}
    </Box>
  );
}

export default StepContent; 