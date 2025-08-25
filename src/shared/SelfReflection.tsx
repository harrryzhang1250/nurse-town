import React, { useState } from "react";
import {
  Box,
  Text,
  Checkbox,
  Textarea,
  Button,
  Paper,
  Center,
} from "@mantine/core";
import SurveyContent from "./SurveyContent";

interface SelfReflectionProps {
  isCompleted: boolean;
  initialData?:
    | any[]
    | {
        checklistItems: any[];
        midSurveyResponses: any;
      };
  onSubmit: (data: any) => void;
  level: number;
}

const defaultChecklistItems = [
  {
    observedBehavior: "Limited Verbal Output",
    description:
      "Student should recognize reduced speech output and document frequency of verbal responses",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Telegraphic Speech",
    description:
      "Student should identify short, incomplete sentences and note communication patterns",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Word-Finding Blocks (Anomia)",
    description:
      "Student should observe difficulty finding words and note specific examples",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Perseveration",
    description:
      "Student should recognize repetitive responses and note when they occur",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Communication-Related Frustration",
    description:
      "Student should identify signs of frustration and document patient reactions",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Reliance on Gestures",
    description:
      "Student should observe non-verbal communication and note gesture types used",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Reduced Initiation",
    description:
      "Student should recognize lack of spontaneous communication and document interaction patterns",
    completed: false,
    notes: "",
  },
  {
    observedBehavior: "Inconsistent Yes/No Responses",
    description:
      "Student should identify unreliable responses and note specific questions asked",
    completed: false,
    notes: "",
  },
];

export const SelfReflection: React.FC<SelfReflectionProps> = ({
  isCompleted,
  onSubmit,
  initialData,
  level,
}) => {
  // Checklist items state
  const [checklistItems, setChecklistItems] = useState<any[]>(
    Array.isArray(initialData) ? initialData : defaultChecklistItems
  );

  // Define survey questions as constants
  const ratingQuestions = [
    "1. This session improved my confidence in interviewing clients with expressive aphasia",
    "2. I felt the patient's responses were realistic",
    "3. I was able to navigate the interaction easily",
    "4. This session was educational and helped me practice useful skills",
    "5. I feel more confident applying these skills when working with other health professionals.",
    "6. The simulation encouraged me to reflect on my clinical reasoning during and after the session.",
    "7. The simulation kept me engaged and motivated to practice new strategies.",
  ];

  const openEndedQuestions = [
    "8. Which behaviors were most challenging for you to respond to, and why?",
    "9. What communication strategies seemed to help the patient most?",
    "10. If you could redo one moment in the simulation, what would you change?",
    "11. How will you apply what you learned in a real clinical setting?",
    "12. What was the most helpful part of this session?",
  ];

  // Mid-Simulation Survey responses
  const [midSurveyResponses, setMidSurveyResponses] = useState<
    Record<string, number | null | string>
  >(() => {
    const initial: Record<string, number | null | string> = {};

    // Initialize rating questions with null
    ratingQuestions.forEach((question) => {
      initial[question] = null;
    });

    // Initialize open-ended questions with empty string
    openEndedQuestions.forEach((question) => {
      initial[question] = "";
    });

    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update checklist items when initialData changes
  React.useEffect(() => {
    if (initialData) {
      if (Array.isArray(initialData)) {
        // Old format - just checklist data
        if (initialData.length > 0) {
          // Merge initialData with defaultChecklistItems to ensure all fields are present
          const mergedData = initialData.map((item, index) => ({
            ...defaultChecklistItems[index], // Include all default fields including expectedResponse
            ...item, // Override with actual data (completed, notes)
          }));
          setChecklistItems(mergedData);
        } else {
          setChecklistItems(defaultChecklistItems);
        }
      } else if (initialData.checklistItems) {
        // New format with separate checklist and survey data
        if (initialData.checklistItems.length > 0) {
          // Merge initialData with defaultChecklistItems to ensure all fields are present
          const mergedData = initialData.checklistItems.map(
            (item: any, index: number) => ({
              ...defaultChecklistItems[index], // Include all default fields including expectedResponse
              ...item, // Override with actual data (completed, notes)
            })
          );
          setChecklistItems(mergedData);
        } else {
          setChecklistItems(defaultChecklistItems);
        }

        // Update mid-survey responses if available
        if (initialData.midSurveyResponses) {
          setMidSurveyResponses(initialData.midSurveyResponses);
        }
      }
    } else {
      setChecklistItems(defaultChecklistItems);
    }
  }, [initialData]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setChecklistItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: checked } : item
      )
    );
  };

  const handleNotesChange = (index: number, notes: string) => {
    setChecklistItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, notes } : item))
    );
  };

  const handleRatingChange = (
    field: keyof typeof midSurveyResponses,
    value: number
  ) => {
    setMidSurveyResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (
    field: keyof typeof midSurveyResponses,
    value: string
  ) => {
    setMidSurveyResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit both checklist and mid-survey data
      const submitData = {
        checklistItems: checklistItems.map(
          ({ observedBehavior, completed, notes }) => ({
            observedBehavior,
            completed,
            notes,
          })
        ),
        midSurveyResponses: midSurveyResponses,
      };
      onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all required fields are filled
  const isFormValid = (): boolean => {
    // Check if all rating questions are answered
    const allRatingQuestionsAnswered = ratingQuestions.every(
      (question) => midSurveyResponses[question] !== null
    );

    // Check if all open-ended questions have at least 15 words
    const countWords = (text: string): number => {
      if (!text || typeof text !== "string") return 0;
      return text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    };

    const allOpenEndedValid = openEndedQuestions.every(
      (question) => countWords(String(midSurveyResponses[question] || "")) >= 15
    );

    return allRatingQuestionsAnswered && allOpenEndedValid;
  };

  const formValid = isFormValid();

  return (
    <Box
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
      }}
    >
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        style={{ backgroundColor: "white" }}
      >
        {/* Header */}
        <Center style={{ marginBottom: "40px" }}>
          <Box ta="center">
            <Box>
              <Text
                fw="bold"
                c="#4f46e5"
                mb="md"
                style={{
                  fontSize: "36px",
                  fontFamily:
                    "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                Level {level} Self-Reflection
              </Text>
              <Text
                size="lg"
                c="dimmed"
                style={{
                  maxWidth: "1000px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Instructions: After your simulation session, complete both the
                self-reflection checklist and the mid-simulation survey below.
                Check the box if you performed the skill during the encounter.
                Use the "Notes" column to jot examples or improvements for next
                time. Following mid-simulation survey, please answer the
                questions based on your experience in the simulation.
              </Text>
            </Box>
          </Box>
        </Center>

        {/* Checklist Section */}
        <Box style={{ marginBottom: "40px" }}>
          {/* Checklist Table */}
          <Box style={{ overflowX: "auto" }}>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.5fr 1fr 2fr",
                gap: "16px",
                minWidth: "800px",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #e9ecef",
              }}
            >
              {/* Header Row */}
              <Box
                style={{
                  fontWeight: "bold",
                  color: "#495057",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Observed Patient Behavior
              </Box>
              <Box
                style={{
                  fontWeight: "bold",
                  color: "#495057",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Description
              </Box>
              <Box
                style={{
                  fontWeight: "bold",
                  color: "#495057",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Completed
              </Box>
              <Box
                style={{
                  fontWeight: "bold",
                  color: "#495057",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Notes
              </Box>

              {/* Checklist Items */}
              {checklistItems.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Observed Behavior */}
                  <Box
                    style={{
                      padding: "16px",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Text
                      size="md"
                      fw={500}
                      c="dark.7"
                      style={{ textAlign: "left" }}
                    >
                      {item.observedBehavior}
                    </Text>
                  </Box>

                  {/* Description */}
                  <Box
                    style={{
                      padding: "16px",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Text
                      size="sm"
                      c="dark.7"
                      style={{ textAlign: "left", lineHeight: "1.4" }}
                    >
                      {item.description}
                    </Text>
                  </Box>

                  {/* Checkbox */}
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Checkbox
                      checked={item.completed}
                      onChange={(event) =>
                        handleCheckboxChange(index, event.currentTarget.checked)
                      }
                      size="md"
                      color="green"
                      disabled={isCompleted}
                      styles={{
                        input: {
                          cursor: isCompleted ? "default" : "pointer",
                          opacity: isCompleted ? 0.6 : 1,
                        },
                      }}
                    />
                  </Box>

                  {/* Notes */}
                  <Box
                    style={{
                      padding: "12px",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Textarea
                      placeholder={
                        isCompleted
                          ? ""
                          : "Add notes, examples, or improvements..."
                      }
                      value={item.notes}
                      onChange={
                        isCompleted
                          ? undefined
                          : (event) =>
                              handleNotesChange(
                                index,
                                event.currentTarget.value
                              )
                      }
                      minRows={3}
                      maxRows={6}
                      size="sm"
                      disabled={isCompleted}
                      styles={{
                        input: {
                          fontSize: "14px",
                          border: "none",
                          borderRadius: "6px",
                          lineHeight: "1.6",
                          backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                          color: isCompleted ? "#9ca3af" : "#111",
                          cursor: isCompleted ? "default" : "text",
                          opacity: isCompleted ? 0.8 : 1,
                        },
                      }}
                    />
                  </Box>
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Mid-Simulation Survey Section */}
        <Box style={{ marginBottom: "40px" }}>
          <Box
            style={{
              overflow: "hidden",
              height: "auto",
            }}
          >
            <SurveyContent
              responses={midSurveyResponses}
              questions={ratingQuestions.map((q) => ({
                field: q as keyof typeof midSurveyResponses,
                text: q,
              }))}
              openEndedQuestions={openEndedQuestions.map((q) => ({
                field: q as keyof typeof midSurveyResponses,
                text: q,
              }))}
              isCompleted={isCompleted}
              onRatingChange={handleRatingChange}
              onTextChange={handleTextChange}
              onSubmit={() => {}} // Empty function since we handle submission in the main form
              title="Mid-Simulation Survey"
              ratingScale={{
                min: 1,
                max: 6,
                leftLabel: "Strongly disagree",
                rightLabel: "Strongly agree",
              }}
              showHeader={false} // 不显示标题和提交按钮
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Center>
          <Button
            onClick={isCompleted ? undefined : handleSubmit}
            size="lg"
            disabled={isCompleted || isSubmitting || !formValid}
            loading={isSubmitting}
            style={{
              backgroundColor: isCompleted
                ? "#9ca3af"
                : formValid
                ? "#4f46e5"
                : "#9ca3af",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: 600,
              padding: "16px 60px",
              transition: "all 0.3s ease",
              minWidth: "400px",
              color: "white",
              cursor: isCompleted
                ? "default"
                : formValid
                ? "pointer"
                : "not-allowed",
              opacity: isCompleted ? 0.8 : formValid ? 1 : 0.7,
              marginTop: "40px",
              marginBottom: "60px",
            }}
            onMouseEnter={(e) => {
              if (!isCompleted && !isSubmitting && formValid) {
                e.currentTarget.style.backgroundColor = "#cd853f";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(168, 140, 118, 0.28)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isCompleted && !isSubmitting && formValid) {
                e.currentTarget.style.backgroundColor = "#4f46e5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }
            }}
          >
            {isCompleted ? "Completed" : "Submit Self-Reflection & Survey"}
          </Button>
        </Center>
      </Paper>
    </Box>
  );
};
