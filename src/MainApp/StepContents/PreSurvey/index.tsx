import { useState, useEffect } from "react";
import SurveyContent from "../../../shared/SurveyContent";
import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  completeStep,
  selectIsStepCompleted,
  setPreSurvey,
  selectPreSurvey,
} from "../../../reducer";
import type { RootState } from "../../../store";
import { Box, Container, Paper, Text, Button } from "@mantine/core";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { updateUserAttributes } from "aws-amplify/auth";
import { Section1Demographics } from "../../../shared/Section1Demographics";

// Use a flexible type that can handle any survey structure
export type SurveyResponse = Record<string, number | null | string>;

export default function PreSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCompleted = useSelector((state: RootState) =>
    selectIsStepCompleted("/pre-survey")(state)
  );
  const preSurveyFromRedux = useSelector((state: RootState) =>
    selectPreSurvey(state)
  );
  const { user } = useAuthenticator((context) => [context.user]);

  const [responses, setResponses] = useState<SurveyResponse>({});

  const getSurvey = async () => {
    if (!user?.username) return;

    try {
      const survey = (await client.getSurvey(user.username)) as any;
      if (survey?.answers) {
        // Backend now handles number conversion, so we can use the data directly
        const surveyData = survey.answers as SurveyResponse;
        setResponses(surveyData);
        // Save to Redux store
        dispatch(setPreSurvey(surveyData));
      }
    } catch (error) {
      // 忽略获取错误
    }
  };

  // Load data from Redux if available, otherwise fetch from server
  useEffect(() => {
    if (preSurveyFromRedux) {
      // Use data from Redux store
      setResponses(preSurveyFromRedux);
    } else {
      // Fetch from server and save to Redux
      getSurvey();
    }
  }, [user?.username, isCompleted, preSurveyFromRedux]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRatingChange = (field: keyof SurveyResponse, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (field: keyof SurveyResponse, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (
    field: keyof SurveyResponse,
    value: number | null
  ) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user?.username) {
      console.error("User not authenticated");
      return;
    }

    try {
      const submissionData = {
        userID: user.username,
        answers: responses,
      };

      await client.submitSurvey(submissionData);

      // Update the current completed step in Cognito
      await updateUserAttributes({
        userAttributes: {
          "custom:currentCompletedStep": "pre-survey",
        },
      });

      // Save to Redux store after successful submission
      dispatch(setPreSurvey(responses));
      dispatch(completeStep("/pre-survey"));
      navigate("/simulation-tutorial");
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  // Section 2 questions (existing questions, renumbered 1-7)
  const section2Questions = [
    {
      field:
        "I feel confident interviewing a client with expressive aphasia" as keyof SurveyResponse,
      text: "1. I feel confident interviewing a client with expressive aphasia",
    },
    {
      field:
        "I feel prepared to modify my language for clients with communication challenges" as keyof SurveyResponse,
      text: "2. I feel prepared to modify my language for clients with communication challenges",
    },
    {
      field:
        "I can interpret and apply hospital discharge documentation effectively" as keyof SurveyResponse,
      text: "3. I can interpret and apply hospital discharge documentation effectively",
    },
    {
      field:
        "I know how to show empathy while gathering clinical information" as keyof SurveyResponse,
      text: "4. I know how to show empathy while gathering clinical information",
    },
    {
      field:
        "I feel confident responding to unexpected client behavior during sessions" as keyof SurveyResponse,
      text: "5. I feel confident responding to unexpected client behavior during sessions",
    },
    {
      field:
        "I believe this simulation will help me build skills I can apply in real clinical settings" as keyof SurveyResponse,
      text: "6. I believe this simulation will help me build skills I can apply in real clinical settings",
    },
  ];

  // Check if all required fields are filled
  const isFormValid = (): boolean => {
    // Check Section 1 required fields
    const section1Required = [
      "age",
      "gender",
      "race",
      "year",
      "coursework",
      "clinical_experience_aphasia",
      "standardized_patient_simulations",
      "online_simulations",
      "helpfulness_previous_simulations",
      "frequency_games",
    ];

    const section1Valid = section1Required.every(
      (field) =>
        responses[field] !== null &&
        responses[field] !== undefined &&
        responses[field] !== ""
    ) as boolean;

    // Check Section 2 rating questions
    const section2RatingValid = section2Questions.every(
      (question) =>
        responses[question.field] !== null &&
        responses[question.field] !== undefined
    ) as boolean;

    // Check Section 2 open-ended question (at least 15 words)
    const countWords = (text: string): number => {
      if (!text || typeof text !== "string") return 0;
      return text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    };

    const openEndedResponse =
      responses["What are you hoping to gain from this simulation experience?"];
    const openEndedValid =
      openEndedResponse &&
      typeof openEndedResponse === "string" &&
      countWords(openEndedResponse) >= 15;

    return Boolean(section1Valid && section2RatingValid && openEndedValid);
  };

  const formValid = isFormValid();

  return (
    <Box
      style={{
        marginTop: "3rem",
        minHeight: "100vh",
        background: "white",
        boxSizing: "border-box",
        overflow: "auto",
        position: "relative",
      }}
    >
      <Container
        size="md"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Paper
          radius="lg"
          style={{
            backgroundColor: "white",
            border: "none",
            boxShadow: "none",
            padding: "20px 20px 40px 20px",
          }}
        >
          {/* Title */}
          <Box ta="center" mb="40px">
            <Text
              fw="bold"
              c="#4f46e5"
              style={{
                fontSize: "36px",
                fontFamily:
                  "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                letterSpacing: "1.5px",
              }}
            >
              Pre-Simulation Survey
            </Text>
          </Box>

          {/* Section 1: Demographics */}
          <Section1Demographics
            responses={responses}
            isCompleted={isCompleted}
            onTextChange={handleTextChange}
            onNumberChange={handleNumberChange}
          />

          {/* Section 2: Confidence Assessment */}
          <Box mb="40px">
            <Text
              fw="bold"
              c="#111"
              mb="20px"
              style={{
                fontSize: "24px",
                borderBottom: "2px solid #4f46e5",
                paddingBottom: "10px",
              }}
            >
              Section 2: Confidence Assessment
            </Text>

            <SurveyContent<SurveyResponse>
              responses={responses}
              questions={section2Questions}
              singleOpenEndedQuestion={{
                field:
                  "What are you hoping to gain from this simulation experience?",
                text: "7. What are you hoping to gain from this simulation experience?",
              }}
              isCompleted={isCompleted}
              onRatingChange={handleRatingChange}
              onTextChange={handleTextChange}
              onSubmit={() => {}} // This will be handled by the main submit button
              title=""
              ratingScale={{
                min: 1,
                max: 6,
                leftLabel: "Not confident at all",
                rightLabel: "Extremely confident",
              }}
              showSubmitButton={false}
              showHeader={false}
            />
          </Box>

          {/* Submit Button */}
          <Box ta="center">
            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={!formValid}
              style={{
                backgroundColor: formValid ? "#4f46e5" : "#9ca3af",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: 600,
                padding: "16px 60px",
                transition: "all 0.3s ease",
                minWidth: "400px",
                color: "white",
                cursor: formValid ? "pointer" : "not-allowed",
                opacity: formValid ? 1 : 0.7,
                marginTop: "40px",
                marginBottom: "60px",
              }}
              onMouseEnter={(e) => {
                if (formValid) {
                  e.currentTarget.style.backgroundColor = "#cd853f";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(168, 140, 118, 0.28)";
                }
              }}
              onMouseLeave={(e) => {
                if (formValid) {
                  e.currentTarget.style.backgroundColor = "#4f46e5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }
              }}
            >
              Submit Survey
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
