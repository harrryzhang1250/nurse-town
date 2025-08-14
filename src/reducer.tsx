import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// Define the interface for PreSurvey response - flexible structure
export interface PreSurveyResponse {
  [key: string]: number | null | string;
}

// Define the interface for each step
export interface Step {
  path: string;
  name: string;
  isCompleted: boolean;
  completedAt?: string; // Changed from Date to string
}

// Define the interface for user-specific step state
interface UserStepState {
  steps: Step[];
  currentCompletedStep: string | null;
  currentStep: string | null; // Add currentStep for rendering
  preSurvey: PreSurveyResponse | null;
  postSurvey: PreSurveyResponse | null;
}

// Define the main state interface that stores data per user
interface StepState {
  userStates: { [userId: string]: UserStepState };
  currentUserId?: string;
}

// Define the initial steps with their paths and names
const initialSteps: Step[] = [
  { path: "/informed-consent", name: "Informed Consent", isCompleted: false },
  { path: "/pre-survey", name: "Pre-Survey", isCompleted: false },
  { path: "/simulation-tutorial", name: "Simulation Tutorial", isCompleted: false },
  { path: "/level-1-simulation", name: "Level 1 Simulation", isCompleted: false },
  { path: "/level-2-simulation", name: "Level 2 Simulation", isCompleted: false },
  { path: "/level-3-simulation", name: "Level 3 Simulation", isCompleted: false },
  { path: "/post-survey", name: "Post-Survey", isCompleted: false },
  { path: "/completion", name: "Completion", isCompleted: false },
];

// Create initial user state
const createInitialUserState = (): UserStepState => ({
  steps: initialSteps.map(step => ({ ...step })),
  currentCompletedStep: null,
  currentStep: "/informed-consent", // Start with first step
  preSurvey: null,
  postSurvey: null,
});

// Helper function to get step index
const getStepIndex = (steps: Step[], stepPath: string): number => {
  // Remove leading slash for comparison
  const cleanPath = stepPath.startsWith('/') ? stepPath.slice(1) : stepPath;
  return steps.findIndex(step => step.path.slice(1) === cleanPath);
};

// Helper function to get next step based on completed step
export const getNextStep = (completedStep: string | null): string => {
  if (!completedStep) return "/informed-consent";
  
  // Remove leading slash for comparison
  const cleanCompletedStep = completedStep.startsWith('/') ? completedStep.slice(1) : completedStep;
  const stepIndex = initialSteps.findIndex(step => step.path.slice(1) === cleanCompletedStep);
  
  if (stepIndex === -1) return "/informed-consent";
  
  // If completed step is the last one, stay on it
  if (stepIndex === initialSteps.length - 1) {
    return initialSteps[stepIndex].path;
  }
  
  // Return next step
  return initialSteps[stepIndex + 1].path;
};

// Helper function to complete a step and all previous steps
const completeStepAndPrevious = (userState: UserStepState, stepPath: string): void => {
  const stepIndex = getStepIndex(userState.steps, stepPath);
  if (stepIndex === -1) return; // if the step is not found, return
  const timestamp = new Date().toISOString();
  
  // Complete all steps up to and including the target step
  for (let i = 0; i <= stepIndex; i++) {
    if (!userState.steps[i].isCompleted) {
      userState.steps[i].isCompleted = true;
      userState.steps[i].completedAt = timestamp;
    }
  }
  
  // Update currentCompletedStep and currentStep
  userState.currentCompletedStep = stepPath;
  userState.currentStep = getNextStep(stepPath);
};

// Initial state
const initialState: StepState = {
  userStates: {},
  currentUserId: undefined,
};

// Create the slice
const stepSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    // Set the current user and initialize their state if needed
    setCurrentUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.currentUserId = userId;
      
      // Initialize user state if it doesn't exist
      if (!state.userStates[userId]) {
        state.userStates[userId] = createInitialUserState();
      }
    },

    // Mark a step as completed for current user (and auto-complete previous steps)
    completeStep: (state, action: PayloadAction<string>) => {
      const stepPath = action.payload;
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      completeStepAndPrevious(userState, stepPath);
    },

    // Auto-complete previous steps based on current route (for page refresh)
    autoCompletePreviousSteps: (state, action: PayloadAction<string>) => {
      const currentPath = action.payload;
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      const currentStepIndex = getStepIndex(userState.steps, currentPath);
      
      if (currentStepIndex === -1) return;
      
      const timestamp = new Date().toISOString();
      
      // Complete all steps before the current step (not including current step)
      for (let i = 0; i < currentStepIndex; i++) {
        if (!userState.steps[i].isCompleted) {
          userState.steps[i].isCompleted = true;
          userState.steps[i].completedAt = timestamp;
        }
      }
    },
    
    // Set the current active step for current user
    setCurrentCompletedStep: (state, action: PayloadAction<string | null>) => {
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      userState.currentCompletedStep = action.payload;
      // Update currentStep based on the new completed step
      userState.currentStep = getNextStep(action.payload)
    },

    // Set pre-survey data for current user
    setPreSurvey: (state, action: PayloadAction<PreSurveyResponse>) => {
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      state.userStates[currentUserId].preSurvey = action.payload;
    },

    // Set post-survey data for current user
    setPostSurvey: (state, action: PayloadAction<PreSurveyResponse>) => {
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      state.userStates[currentUserId].postSurvey = action.payload;
    },
  },
});

// Export actions
export const { 
  setCurrentUser,
  completeStep, 
  autoCompletePreviousSteps, // New action
  setCurrentCompletedStep, 
  setPreSurvey,
  setPostSurvey
} = stepSlice.actions;

// Base selectors
// const selectStepState = (state: { steps: StepState }) => state.steps;
const selectCurrentUserId = (state: { steps: StepState }) => state.steps.currentUserId;
const selectUserStates = (state: { steps: StepState }) => state.steps.userStates;

// Memoized selector to get current user state
const selectCurrentUserState = createSelector(
  [selectCurrentUserId, selectUserStates],
  (currentUserId, userStates): UserStepState | null => {
    if (!currentUserId || !userStates[currentUserId]) {
      return null;
    }
    return userStates[currentUserId];
  }
);

// Memoized selectors (now user-specific)
export const selectAllSteps = createSelector(
  [selectCurrentUserState],
  (userState): Step[] => {
    return userState ? userState.steps : [];
  }
);

export const selectCurrentStep = createSelector(
  [selectCurrentUserState],
  (userState): string | null => {
    return userState ? userState.currentStep : null;
  }
);

export const selectCompletedSteps = createSelector(
  [selectCurrentUserState],
  (userState): Step[] => {
    return userState ? userState.steps.filter(step => step.isCompleted) : [];
  }
);

export const selectCompletedStepPaths = createSelector(
  [selectCompletedSteps],
  (completedSteps): string[] => {
    return completedSteps.map(step => step.path);
  }
);

export const selectStepByPath = (path: string) => createSelector(
  [selectCurrentUserState],
  (userState): Step | undefined => {
    return userState ? userState.steps.find(step => step.path === path) : undefined;
  }
);

export const selectIsStepCompleted = (path: string) => createSelector(
  [selectCurrentUserState],
  (userState): boolean => {
    return userState ? userState.steps.find(step => step.path === path)?.isCompleted || false : false;
  }
);

export const selectProgressPercentage = createSelector(
  [selectCurrentUserState],
  (userState): number => {
    if (!userState) return 0;
    
    const completed = userState.steps.filter(step => step.isCompleted).length;
    return Math.round((completed / (userState.steps.length - 1)) * 100);
  }
);

// Pre-survey selectors
export const selectPreSurvey = createSelector(
  [selectCurrentUserState],
  (userState): PreSurveyResponse | null => {
    return userState ? userState.preSurvey : null;
  }
);

export const selectHasPreSurvey = createSelector(
  [selectPreSurvey],
  (preSurvey): boolean => {
    return preSurvey !== null;
  }
);

// Post-survey selectors
export const selectPostSurvey = createSelector(
  [selectCurrentUserState],
  (userState): PreSurveyResponse | null => {
    return userState ? userState.postSurvey : null;
  }
);

export const selectHasPostSurvey = createSelector(
  [selectPostSurvey],
  (postSurvey): boolean => {
    return postSurvey !== null;
  }
);

// Export the current user ID selector
export { selectCurrentUserId };

// Export the reducer
export default stepSlice.reducer;