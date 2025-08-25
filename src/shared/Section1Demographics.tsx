import React, { useState } from "react";
import {
  Box,
  Text,
  Stack,
  Select,
  NumberInput,
  Textarea,
  Group,
  UnstyledButton,
} from "@mantine/core";

interface Section1DemographicsProps {
  responses: Record<string, number | null | string>;
  isCompleted: boolean;
  onTextChange: (field: string, value: string) => void;
  onNumberChange: (field: string, value: number | null) => void;
}

// Custom rating component for Y/N questions with dropdown design
const YesNoDropdown: React.FC<{
  value: string | null;
  onChange: (value: string) => void;
  isCompleted: boolean;
}> = ({ value, onChange, isCompleted }) => {
  return (
    <Select
      value={value || ""}
      onChange={(newValue) => onChange(newValue || "")}
      placeholder="Select Yes or No"
      data={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      disabled={isCompleted}
      style={{ maxWidth: "200px", marginTop: "10px" }}
      styles={{
        input: {
          backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          padding: "14px",
        },
      }}
    />
  );
};

// Custom rating component for 1-6 scale questions (reusing SurveyContent style)
const ScaleRating: React.FC<{
  value: number | null;
  onChange: (value: number | null) => void;
  isCompleted: boolean;
  leftLabel: string;
  rightLabel: string;
}> = ({ value, onChange, isCompleted, leftLabel, rightLabel }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const ratingValues = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <Box style={{ width: "100%", margin: "20px auto" }}>
      {/* Rating scale with labels */}
      <Group
        justify="space-between"
        align="center"
        style={{
          marginBottom: "10px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: isCompleted ? "#9ca3af" : "#666",
            fontWeight: 500,
          }}
        >
          {leftLabel}
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: isCompleted ? "#9ca3af" : "#666",
            fontWeight: 500,
          }}
        >
          {rightLabel}
        </Text>
      </Group>

      {/* Number labels */}
      <Group
        justify="space-between"
        align="center"
        style={{
          marginBottom: "5px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {ratingValues.map((number) => (
          <Text
            key={number}
            style={{
              fontSize: "14px",
              color: isCompleted ? "#9ca3af" : "#999",
              width: "30px",
              textAlign: "center",
            }}
          >
            {number}
          </Text>
        ))}
      </Group>

      {/* Rating circles */}
      <Group
        justify="space-between"
        align="center"
        style={{ paddingLeft: "15px", paddingRight: "15px" }}
      >
        {ratingValues.map((rating) => {
          const isActive =
            hoveredRating !== null
              ? rating === hoveredRating
              : value === rating;

          return (
            <UnstyledButton
              key={rating}
              onClick={isCompleted ? undefined : () => onChange(rating)}
              onMouseEnter={
                isCompleted ? undefined : () => setHoveredRating(rating)
              }
              onMouseLeave={
                isCompleted ? undefined : () => setHoveredRating(null)
              }
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: `2px solid ${isCompleted ? "#9ca3af" : "#ddd"}`,
                backgroundColor: isActive
                  ? isCompleted
                    ? "#9ca3af"
                    : "#ffa500"
                  : "transparent",
                transition: "all 0.2s ease",
                cursor: isCompleted ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: isCompleted
                  ? "scale(1)"
                  : hoveredRating === rating
                  ? "scale(1.1)"
                  : "scale(1)",
                opacity: isCompleted ? 0.8 : 1,
              }}
            >
              {isActive && (
                <Box
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "white",
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

export const Section1Demographics: React.FC<Section1DemographicsProps> = ({
  responses,
  isCompleted,
  onTextChange,
  onNumberChange,
}) => {
  return (
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
        Section 1: Demographics and Background Information
      </Text>

      <Stack gap="sm" style={{ marginBottom: "40px" }}>
        {/* Age */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              1. Age*
            </Text>
            <NumberInput
              value={(responses["age"] as number) || undefined}
              onChange={(value) =>
                onNumberChange("age", typeof value === "number" ? value : null)
              }
              placeholder="Enter your age"
              min={16}
              max={100}
              disabled={isCompleted}
              style={{ maxWidth: "200px", marginTop: "10px" }}
              styles={{
                input: {
                  backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
            />
          </Group>
        </Box>

        {/* Gender */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              2. Gender*
            </Text>
            <Select
              value={(responses["gender"] as string) || ""}
              onChange={(value) => onTextChange("gender", value || "")}
              placeholder="Select your gender"
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              disabled={isCompleted}
              style={{ maxWidth: "300px", marginTop: "10px" }}
              styles={{
                input: {
                  backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
            />
          </Group>
        </Box>

        {/* Race/Ethnicity */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              3. Race / Ethnicity*
            </Text>
            <Select
              value={(responses["race"] as string) || ""}
              onChange={(value) => onTextChange("race", value || "")}
              placeholder="Select your race/ethnicity"
              data={[
                { value: "white", label: "White" },
                { value: "black", label: "Black or African American" },
                { value: "hispanic", label: "Hispanic or Latino" },
                { value: "asian", label: "Asian" },
                {
                  value: "native_american",
                  label: "Native American or Alaska Native",
                },
                {
                  value: "pacific_islander",
                  label: "Native Hawaiian or Pacific Islander",
                },
                { value: "mixed", label: "Mixed Race" },
                { value: "other", label: "Other" },
                { value: "prefer_not_to_say", label: "Prefer not to say" },
              ]}
              disabled={isCompleted}
              style={{ maxWidth: "400px", marginTop: "10px" }}
              styles={{
                input: {
                  backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
            />
          </Group>
        </Box>

        {/* Year in MS-SLP Program */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              4. Year in MS-SLP Program*
            </Text>
            <NumberInput
              value={(responses["year"] as number) || undefined}
              onChange={(value) =>
                onNumberChange("year", typeof value === "number" ? value : null)
              }
              placeholder="Enter year (1-4)"
              min={1}
              max={4}
              disabled={isCompleted}
              style={{ maxWidth: "200px", marginTop: "10px" }}
              styles={{
                input: {
                  backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  padding: "14px",
                },
              }}
            />
          </Group>
        </Box>

        {/* Completed coursework */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              5. Completed coursework (aphasia, diagnostics, counseling)*
            </Text>
            <Textarea
              value={(responses["coursework"] as string) || ""}
              onChange={
                isCompleted
                  ? undefined
                  : (e) => onTextChange("coursework", e.target.value)
              }
              placeholder={
                isCompleted
                  ? ""
                  : "Please describe your completed coursework..."
              }
              autosize
              minRows={5}
              maxRows={10}
              size="lg"
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                border: "none",
                width: "100%",
                marginTop: "10px",
              }}
              styles={{
                input: {
                  backgroundColor: isCompleted ? "#f8f9fa" : "#f3f4f6",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  color: isCompleted ? "#9ca3af" : "#111",
                  padding: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: isCompleted ? "default" : "text",
                },
              }}
            />
          </Group>
        </Box>

        {/* Clinical experience with adults with aphasia */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              6. Clinical experience with adults with aphasia (Y/N)*
            </Text>
            <YesNoDropdown
              value={
                (responses["clinical_experience_aphasia"] as string) || null
              }
              onChange={(value) =>
                onTextChange("clinical_experience_aphasia", value)
              }
              isCompleted={isCompleted}
            />
          </Group>
        </Box>

        {/* Participation in standardized patient simulations */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              7. Participation in standardized patient simulations (Y/N)*
            </Text>
            <YesNoDropdown
              value={
                (responses["standardized_patient_simulations"] as string) ||
                null
              }
              onChange={(value) =>
                onTextChange("standardized_patient_simulations", value)
              }
              isCompleted={isCompleted}
            />
          </Group>
        </Box>

        {/* Use of online simulations or virtual patients */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              8. Use of online simulations or virtual patients (Y/N)*
            </Text>
            <YesNoDropdown
              value={(responses["online_simulations"] as string) || null}
              onChange={(value) => onTextChange("online_simulations", value)}
              isCompleted={isCompleted}
            />
          </Group>
        </Box>

        {/* Helpfulness of previous simulations */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              9. Helpfulness of previous simulations (1–6)*
            </Text>
            <ScaleRating
              value={
                (responses["helpfulness_previous_simulations"] as number) ||
                null
              }
              onChange={(value) =>
                onNumberChange("helpfulness_previous_simulations", value)
              }
              isCompleted={isCompleted}
              leftLabel="Not helpful at all"
              rightLabel="Extremely helpful"
            />
          </Group>
        </Box>

        {/* Frequency of playing games for fun */}
        <Box>
          <Group style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Text
              fw={600}
              c="#111"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              10. Frequency of playing games for fun (1–6)*
            </Text>
            <ScaleRating
              value={(responses["frequency_games"] as number) || null}
              onChange={(value) => onNumberChange("frequency_games", value)}
              isCompleted={isCompleted}
              leftLabel="Never"
              rightLabel="Very frequently"
            />
          </Group>
        </Box>
      </Stack>
    </Box>
  );
};
