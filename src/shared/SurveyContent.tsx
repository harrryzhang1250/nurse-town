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
  Center,
} from '@mantine/core';

// Generic survey response interface
interface BaseSurveyResponse {
  [key: string]: number | null | string;
}

interface RatingQuestion<T extends BaseSurveyResponse> {
  field: keyof T;
  text: string;
}

interface OpenEndedQuestion<T extends BaseSurveyResponse> {
  field: keyof T;
  text: string;
}

interface SurveyContentProps<T extends BaseSurveyResponse> {
  responses: T;
  questions: Array<RatingQuestion<T>>;
  openEndedQuestions?: Array<OpenEndedQuestion<T>>;
  singleOpenEndedQuestion?: {
    field: keyof T;
    text: string;
  };
  isCompleted?: boolean;
  onRatingChange: (field: keyof T, value: number) => void;
  onTextChange: (field: keyof T, value: string) => void;
  onSubmit: () => void;
  title: string;
  ratingScale?: {
    min: number;
    max: number;
    leftLabel: string;
    rightLabel: string;
  };
  showSubmitButton?: boolean;
  showHeader?: boolean;  // 新增：控制是否显示标题和提交按钮
}

// Helper function to count words
const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Helper function to check if text meets minimum word requirement
const meetsWordRequirement = (text: string, minWords: number = 15): boolean => {
  return countWords(text) >= minWords;
};

function SurveyContent<T extends BaseSurveyResponse>({
  responses,
  questions,
  openEndedQuestions,
  singleOpenEndedQuestion,
  isCompleted = false,
  onRatingChange,
  onTextChange,
  onSubmit,
  title,
  ratingScale = {
    min: 0,
    max: 5,
    leftLabel: 'Not confident at all',
    rightLabel: 'Extremely confident'
  },
  showSubmitButton = true,
  showHeader = true
}: SurveyContentProps<T>) {
  // Calculate form validity internally
  const isFormValid = (): boolean => {
    // Check if all rating questions are answered
    const allRatingQuestionsAnswered = questions.every(question => 
      responses[question.field] !== null && responses[question.field] !== undefined
    );
    
    // Check if single open-ended question meets word requirement
    const singleOpenEndedValid = !singleOpenEndedQuestion || 
      (responses[singleOpenEndedQuestion.field] && 
       meetsWordRequirement(responses[singleOpenEndedQuestion.field] as string));
    
    // Check if all multiple open-ended questions meet word requirement
    const multipleOpenEndedValid = !openEndedQuestions || 
      openEndedQuestions.every(question => 
        responses[question.field] && 
        meetsWordRequirement(responses[question.field] as string)
      );
    
    return allRatingQuestionsAnswered && singleOpenEndedValid && multipleOpenEndedValid;
  };

  const formValid = isFormValid();

  const StarRating: React.FC<{ 
    field: keyof T, 
    value: number | null,
    onChange: (value: number) => void 
  }> = ({ value, onChange }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    
    const ratingValues = Array.from(
      { length: ratingScale.max - ratingScale.min + 1 }, 
      (_, i) => i + ratingScale.min
    );

    return (
      <Box style={{ width: '100%', margin: '20px auto' }}>
        {/* Rating scale with labels */}
        <Group justify="space-between" align="center" style={{ marginBottom: '10px' }}>
          <Text style={{ 
            fontSize: '14px', 
            color: isCompleted ? '#9ca3af' : '#666', 
            fontWeight: 500 
          }}>
            {ratingScale.leftLabel}
          </Text>
          <Text style={{ 
            fontSize: '14px', 
            color: isCompleted ? '#9ca3af' : '#666', 
            fontWeight: 500 
          }}>
            {ratingScale.rightLabel}
          </Text>
        </Group>

        {/* Number labels */}
        <Group justify="space-between" align="center" style={{ marginBottom: '5px', paddingLeft: '15px', paddingRight: '15px' }}>
          {ratingValues.map(number => (
            <Text key={number} style={{ 
              fontSize: '14px', 
              color: isCompleted ? '#9ca3af' : '#999', 
              width: '30px', 
              textAlign: 'center' 
            }}>
              {number}
            </Text>
          ))}
        </Group>

        {/* Rating circles */}
        <Group justify="space-between" align="center" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          {ratingValues.map(rating => {
            const isActive = hoveredRating !== null 
              ? rating === hoveredRating 
              : value === rating;

            return (
              <UnstyledButton
                key={rating}
                onClick={isCompleted ? undefined : () => onChange(rating)}
                onMouseEnter={isCompleted ? undefined : () => setHoveredRating(rating)}
                onMouseLeave={isCompleted ? undefined : () => setHoveredRating(null)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: `2px solid ${isCompleted ? '#9ca3af' : '#ddd'}`,
                  backgroundColor: isActive ? (isCompleted ? '#9ca3af' : '#ffa500') : 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: isCompleted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isCompleted ? 'scale(1)' : (hoveredRating === rating ? 'scale(1.1)' : 'scale(1)'),
                  opacity: isCompleted ? 0.8 : 1
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
        minHeight: '100%',
        background: 'white',
        marginTop: '1.5rem',
        padding: '20px 20px 40px 20px',
        boxSizing: 'border-box' as const,
        position: 'relative',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'visible'
      }}
    >
      <Container size="md" style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <Paper
          radius="lg"
          style={{
            backgroundColor: 'white',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {showHeader && (
            <>
              {/* Logo and Title */}
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
                      {title}
                    </Text>
                  </Box>
                </Box>
              </Center>
            </>
          )}

          <Stack gap="sm" style={{ marginBottom: '40px' }}>
            {/* Rating questions */}
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

            {/* Single open-ended question (for PreSurvey) */}
            {singleOpenEndedQuestion && (
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
                  {singleOpenEndedQuestion.text}* (at least 15 words)
                </Text>
                <Textarea
                  value={responses[singleOpenEndedQuestion.field] as string}
                  onChange={isCompleted ? undefined : (e) => onTextChange(singleOpenEndedQuestion.field, e.target.value)}
                  placeholder={isCompleted ? "" : "Type here..."}
                  autosize
                  minRows={5}
                  maxRows={10}
                  size="lg"
                  disabled={isCompleted}
                  style={{
                    backgroundColor: isCompleted ? '#f8f9fa' : '#f3f4f6',
                    border: 'none',
                    width: '100%'
                  }}
                  styles={{
                    input: {
                      backgroundColor: isCompleted ? '#f8f9fa' : '#f3f4f6',
                      border: isCompleted ? 'none' : 
                        (responses[singleOpenEndedQuestion.field] && 
                         !meetsWordRequirement(responses[singleOpenEndedQuestion.field] as string)) 
                        ? '2px solid #e53e3e' : 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: isCompleted ? '#9ca3af' : '#111',
                      padding: '14px',
                      width: '100%',
                      boxSizing: 'border-box',
                      cursor: isCompleted ? 'default' : 'text'
                    }
                  }}
                />
                {responses[singleOpenEndedQuestion.field] && 
                 !meetsWordRequirement(responses[singleOpenEndedQuestion.field] as string) && (
                  <Text 
                    c="#e53e3e" 
                    size="sm" 
                    mt="xs"
                    style={{ fontStyle: 'italic' }}
                  >
                    Please provide at least 15 words. Current word count: {countWords(responses[singleOpenEndedQuestion.field] as string)}
                  </Text>
                )}
              </Box>
            )}

            {/* Multiple open-ended questions (for PostSurvey) */}
            {openEndedQuestions && openEndedQuestions.length > 0 && (
              <Box style={{ marginTop: '20px' }}>
                {openEndedQuestions.map((question, index) => (
                  <Box key={index}>
                    <Text 
                      fw={600}
                      mb="md"
                      c="#111"
                      style={{
                        fontSize: '18px',
                        textAlign: 'left',
                      }}
                    >
                      {question.text}* (at least 15 words)
                    </Text>
                    <Textarea
                      value={responses[question.field] as string}
                      onChange={isCompleted ? undefined : (e) => onTextChange(question.field, e.target.value)}
                      placeholder={isCompleted ? "" : "Type here..."}
                      autosize
                      minRows={5}
                      size="lg"
                      disabled={isCompleted}
                      style={{
                        backgroundColor: isCompleted ? '#f8f9fa' : '#f3f4f6',
                        border: 'none',
                        width: '100%'
                      }}
                      styles={{
                        input: {
                          backgroundColor: isCompleted ? '#f8f9fa' : '#f3f4f6',
                          border: isCompleted ? 'none' : 
                            (responses[question.field] && 
                             !meetsWordRequirement(responses[question.field] as string)) 
                            ? '2px solid #e53e3e' : 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          color: isCompleted ? '#9ca3af' : '#111',
                          padding: '14px',
                          width: '100%',
                          boxSizing: 'border-box',
                          cursor: isCompleted ? 'default' : 'text'
                        }
                      }}
                    />
                    {responses[question.field] && 
                     !meetsWordRequirement(responses[question.field] as string) && (
                      <Text 
                        c="#e53e3e" 
                        size="sm" 
                        mt="xs"
                        style={{ fontStyle: 'italic' }}
                      >
                        Please provide at least 15 words. Current word count: {countWords(responses[question.field] as string)}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Stack>

          {/* Submit Button */}
          {showHeader && showSubmitButton && (
            <Center>
              <Button
                onClick={onSubmit}
                size="lg"
                disabled={!formValid}
                style={{
                  backgroundColor: formValid ? '#4f46e5' : '#9ca3af',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '16px 60px',
                  transition: 'all 0.3s ease',
                  minWidth: '400px',
                  color: 'white',
                  cursor: formValid ? 'pointer' : 'not-allowed',
                  opacity: formValid ? 1 : 0.7,
                  marginTop: '40px',
                  marginBottom: '60px'
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
                    e.currentTarget.style.backgroundColor = '#4f46e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              >
                Submit Survey
              </Button>
            </Center>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default SurveyContent; 