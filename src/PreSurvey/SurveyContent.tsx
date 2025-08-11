import React, { useState } from 'react';
import {
  Container,
  Paper,
  Text,
  Group,
  Button,
  Textarea,
  Stack,
  Box,
  UnstyledButton,
  Center
} from '@mantine/core';

interface SurveyResponse {
  expressiveAphasia: number | null;
  modifyLanguage: number | null;
  hospitalDischarge: number | null;
  showEmpathy: number | null;
  unexpectedBehavior: number | null;
  simulationSkills: number | null;
  openEnded: string;
}

interface SurveyContentProps {
  responses: SurveyResponse;
  questions: Array<{
    field: keyof SurveyResponse;
    text: string;
  }>;
  formValid: boolean;
  onRatingChange: (field: keyof SurveyResponse, value: number) => void;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
}

const SurveyContent: React.FC<SurveyContentProps> = ({
  responses,
  questions,
  formValid,
  onRatingChange,
  onTextChange,
  onSubmit
}) => {
  const StarRating: React.FC<{ 
    field: keyof SurveyResponse, 
    value: number | null,
    onChange: (value: number) => void 
  }> = ({ value, onChange }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    return (
      <Box style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
        {/* Rating scale with labels */}
        <Group justify="space-between" align="center" style={{ marginBottom: '10px' }}>
          <Text style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Not confident at all
          </Text>
          <Text style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Extremely confident
          </Text>
        </Group>

        {/* Number labels */}
        <Group justify="space-between" align="center" style={{ marginBottom: '5px', paddingLeft: '15px', paddingRight: '15px' }}>
          {[0, 1, 2, 3, 4, 5].map(number => (
            <Text key={number} style={{ fontSize: '14px', color: '#999', width: '30px', textAlign: 'center' }}>
              {number}
            </Text>
          ))}
        </Group>

        {/* Rating circles */}
        <Group justify="space-between" align="center" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          {[0, 1, 2, 3, 4, 5].map(rating => {
            const isActive = hoveredRating !== null 
              ? rating === hoveredRating 
              : value === rating;

            return (
              <UnstyledButton
                key={rating}
                onClick={() => onChange(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(null)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '2px solid #ddd',
                  backgroundColor: isActive ? '#ffa500' : 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: hoveredRating === rating ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {isActive && (
                  <Box
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'white'
                    }}
                  />
                )}
              </UnstyledButton>
            );
          })}
        </Group>
      </Box>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'white',
        overflowY: 'auto',
        zIndex: 1000
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '40px 20px',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Decorative circles */}
        <Box
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            zIndex: 0
          }}
        />

        <Container size="md" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Paper
            p="xl"
            radius="lg"
            style={{
              backgroundColor: 'white',
              border: 'none'
            }}
          >
            {/* Logo and Title */}
            <Center>
              <Box ta="center">
                <Box>
                  <Text
                    fw="bold"
                    c="#e67e22"
                    mb="md"
                    style={{
                      fontSize: '36px',
                      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      letterSpacing: '1.5px'
                    }}
                  >
                    Pre-Simulation Survey
                  </Text>
                </Box>
              </Box>
            </Center>

            <Stack>
              {questions.map((question, index) => (
                <Box key={index}>
                  <Text 
                    fw={600} 
                    c="#111"
                    style={{ 
                      fontSize: '18px',
                      lineHeight: 1.5, 
                      textAlign: 'left' 
                    }}
                  >
                    {question.text}*
                  </Text>
                  <StarRating 
                    field={question.field} 
                    value={responses[question.field] as number | null}
                    onChange={(value) => onRatingChange(question.field, value)}
                  />
                </Box>
              ))}

              {/* Open-ended question */}
              <Box>
                <Text 
                  fw={600}
                  mb="md"
                  c="#111"
                  style={{ 
                    fontSize: '18px',
                    textAlign: 'left',
                  }}
                >
                  What are you hoping to gain from this simulation experience?*
                </Text>
                <Textarea
                  value={responses.openEnded}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="Type here..."
                  autosize
                  minRows={5}
                  maxRows={10}
                  size="lg"
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    width: '100%'
                  }}
                  styles={{
                    input: {
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#111',
                      padding: '14px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }
                  }}
                />
              </Box>
            </Stack>

            <Center>
              <Button
                onClick={onSubmit}
                size="lg"
                disabled={!formValid}
                style={{
                  backgroundColor: formValid ? '#d2691e' : '#f4a261',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '16px 60px',
                  transition: 'all 0.3s ease',
                  minWidth: '400px',
                  color: formValid ? 'white' : '#ffffff',
                  cursor: formValid ? 'pointer' : 'not-allowed',
                  opacity: formValid ? 1 : 0.7,
                  marginTop: '40px'
                }}
                onMouseEnter={(e) => {
                  if (formValid) {
                    e.currentTarget.style.backgroundColor = '#cd853f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 140, 118, 0.28)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formValid) {
                    e.currentTarget.style.backgroundColor = '#d2691e';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              >
                Submit Survey
              </Button>
            </Center>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default SurveyContent; 