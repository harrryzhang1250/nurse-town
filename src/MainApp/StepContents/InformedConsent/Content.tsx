import { Box, Text, Button, Paper, Stack } from '@mantine/core';

interface InformedConsentContentProps {
  isCompleted: boolean;
  onComplete: () => void;
}

export default function InformedConsentContent({ isCompleted, onComplete }: InformedConsentContentProps) {
  const containerStyle = {
    paddingTop: '50px',
    minHeight: '100vh',
    background: 'white',
    padding: '50px 20px 20px',
    boxSizing: 'border-box' as const
  };

  const paperStyle = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const titleStyle = {
    lineHeight: 1.6
  };

  const getButtonStyle = (isCompleted: boolean) => ({
    backgroundColor: isCompleted ? '#gray' : '#4f46e5',
    margin: '0 auto',
    minWidth: '200px'
  });

  return (
    <Box style={containerStyle}>
      <Paper p="xl" radius="lg" style={paperStyle}>
        <Stack gap="lg">
          <Text size="xl" fw={700} c="#4f46e5" ta="center">
            Informed Consent
          </Text>
          
          <Text size="md" style={titleStyle}>
            TBD
          </Text>
          
          <Button
            onClick={onComplete}
            disabled={isCompleted}
            size="lg"
            style={getButtonStyle(isCompleted)}
          >
            {isCompleted ? 'Completed' : 'I Agree and Consent'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
} 