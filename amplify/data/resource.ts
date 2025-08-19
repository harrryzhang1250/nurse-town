import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Pre-Survey Answers table
  PreSurveyAnswers: a
    .model({
      userID: a.string().required(),
      answers: a.json(),
      createdAt: a.string().required(),
      updatedAt: a.string().required(),
    })
    .identifier(["userID"])
    .authorization((allow) => [allow.authenticated()]),

  // Post-Survey Answers table
  PostSurveyAnswers: a
    .model({
      userID: a.string().required(),
      answers: a.json(),
      createdAt: a.string().required(),
      updatedAt: a.string().required(),
    })
    .identifier(["userID"])
    .authorization((allow) => [allow.authenticated()]),

  // Chat History table
  SimulationData: a
    .model({
      userID: a.string().required(),
      simulationLevel: a.integer().required(),
      chatHistory: a.json(),
      createdAt: a.string().required(),
      updatedAt: a.string().required(),
    })
    .identifier(["userID", "simulationLevel"])
    .authorization((allow) => [allow.authenticated()]),

  // Debrief Answers table
  DebriefAnswers: a
    .model({
      userID: a.string().required(),
      simulationLevel: a.integer().required(),
      answers: a.json(),
      createdAt: a.string().required(),
      updatedAt: a.string().required(),
    })
    .identifier(["userID", "simulationLevel"])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});