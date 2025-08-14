import { Box, Text, Button, Paper, Stack, Center, Grid, List } from '@mantine/core';

interface SimulationTutorialContentProps {
  isCompleted: boolean;
  onComplete: () => void;
}

export default function SimulationTutorialContent({ isCompleted, onComplete }: SimulationTutorialContentProps) {
  const containerStyle = {
    paddingTop: '50px',
    minHeight: '100vh',
    background: 'white',
    padding: '50px 20px 20px',
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'auto'
  };

  const paperStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#4f46e5',
    marginBottom: '20px',
    marginTop: '30px'
  };

  const subsectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '15px',
    marginTop: '25px'
  };

  const bodyTextStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: '16px',
    textAlign: 'left' as const
  };

  const listItemStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: '8px',
    textAlign: 'left' as const
  };

  const highlightBoxStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  };

  const getButtonStyle = (isCompleted: boolean) => ({
    backgroundColor: isCompleted ? '#9ca3af' : '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    padding: '16px 40px',
    transition: 'all 0.3s ease',
    minWidth: '200px',
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
                  Simulation Tutorial
                </Text>
              </Box>
            </Box>
          </Center>

          <Box style={highlightBoxStyle}>
            <Text style={bodyTextStyle}>
              Before the session, the simulation will present:
            </Text>
            <List>
              <List.Item>The learning objectives</List.Item>
              <List.Item>Instructions for interacting with the virtual patient</List.Item>
              <List.Item>A short tutorial guide</List.Item>
            </List>
          </Box>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text style={sectionTitleStyle}>Learning Objectives</Text>
              <Text style={bodyTextStyle}>
                By the end of the simulation, you should be able to:
              </Text>
              <List>
                <List.Item>Use supportive communication strategies</List.Item>
                <List.Item>Maintain a patient-centered, empathetic tone</List.Item>
                <List.Item>Flexibly collect relevant medical and personal history</List.Item>
                <List.Item>Acknowledge and validate the patient's emotional experience</List.Item>
                <List.Item>Initiate collaborative, goal-oriented care planning</List.Item>
              </List>

              <Text style={sectionTitleStyle}>How to Interact with the Virtual Patient</Text>
              <Text style={bodyTextStyle}>
                The simulation mirrors a real-world therapy session with a virtual patient diagnosed with Broca's aphasia.
              </Text>

              <Text style={subsectionTitleStyle}>Step-by-Step Guide</Text>
              
              <Text style={subsectionTitleStyle}>1. Starting the Session</Text>
              <Text style={listItemStyle}>• Click "Start" to enter the simulation room.</Text>

              <Text style={subsectionTitleStyle}>2. Initiating Communication</Text>
              <Text style={listItemStyle}>• The virtual patient will appear on screen.</Text>
              <Text style={listItemStyle}>• Press the 'R' key to begin speaking.</Text>
              <Text style={listItemStyle}>• The patient will respond after your turn.</Text>
              <Text style={listItemStyle}>• Press 'R' again to continue the dialogue.</Text>
              <Text style={listItemStyle}>• Turns will alternate, as in a live session.</Text>

              <Text style={subsectionTitleStyle}>3. Engaging in the Session</Text>
              <Text style={listItemStyle}>• Use clinical skills to guide the conversation.</Text>
              <Text style={listItemStyle}>• There is no fixed script; every session is flexible and responsive.</Text>
              <Text style={listItemStyle}>• The session can be ended anytime by clicking "Finish."</Text>

              <Text style={subsectionTitleStyle}>4. Receiving Feedback</Text>
              <Text style={listItemStyle}>• After the session, an AI-generated feedback report will be immediately received.</Text>
              <Text style={listItemStyle}>• The report includes assessment in the following areas:</Text>
              <Box ml="md">
                <Text style={listItemStyle}>• Rapport building and empathy</Text>
                <Text style={listItemStyle}>• Communication strategies</Text>
                <Text style={listItemStyle}>• Information gathering</Text>
                <Text style={listItemStyle}>• Clinical reasoning</Text>
                <Text style={listItemStyle}>• Professionalism</Text>
                <Text style={listItemStyle}>• Responsiveness to Patient's Feedback</Text>
              </Box>
              <Text style={listItemStyle}>• Feedback can be revisited anytime via the dashboard.</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text style={sectionTitleStyle}>What to Expect</Text>
              
              <Text style={subsectionTitleStyle}>A. Safe Space to Practice</Text>
              <Text style={bodyTextStyle}>
                Users can explore communication strategies, make mistakes, and learn through hands-on experience.
              </Text>

              <Text style={subsectionTitleStyle}>B. Realistic Interaction</Text>
              <Text style={bodyTextStyle}>
                Users will engage with a lifelike virtual patient who simulates the challenges of Broca's aphasia.
              </Text>

              <Text style={subsectionTitleStyle}>C. Skill Development Focus</Text>
              <Text style={bodyTextStyle}>
                Users can refine their abilities in:
              </Text>
              <List>
                <List.Item>Patient-centered interviewing</List.Item>
                <List.Item>Empathetic communication</List.Item>
                <List.Item>Clinical reasoning and decision-making</List.Item>
              </List>

              <Text style={subsectionTitleStyle}>D. Immediate, Personalized Feedback</Text>
              <Text style={bodyTextStyle}>
                The post-session report highlights strengths and growth areas.
              </Text>

              <Text style={subsectionTitleStyle}>E. No Grades or Evaluations</Text>
              <Text style={bodyTextStyle}>
                This is a formative, low-stakes environment focused on learning, not performance.
              </Text>

              <Text style={subsectionTitleStyle}>F. Opportunities for Reflection</Text>
              <Text style={bodyTextStyle}>
                A debriefing and feedback interview allows reflection on the experience and helps shape future simulations.
              </Text>

              <Text style={subsectionTitleStyle}>G. Self-Paced Format</Text>
              <Text style={bodyTextStyle}>
                Users control the pace—they can start, pause, and complete the simulation on their own schedule.
              </Text>
            </Grid.Col>
          </Grid>

          <Center>
            <Button
              onClick={onComplete}
              disabled={isCompleted}
              size="lg"
              style={getButtonStyle(isCompleted)}
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
              {isCompleted ? 'Completed' : 'Begin Simulation'}
            </Button>
          </Center>
        </Stack>
      </Paper>
    </Box>
  );
}
