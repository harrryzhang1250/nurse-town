import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

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
  currentStep: string;
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
  { path: "/sign-up-study", name: "Sign Up for Study", isCompleted: false },
  { path: "/post-survey", name: "Post-Survey", isCompleted: false },
  { path: "/sign-up-interview", name: "Sign Up for Interview", isCompleted: false },
];

// Create initial user state
const createInitialUserState = (): UserStepState => ({
  steps: initialSteps.map(step => ({ ...step })),
  currentStep: "/informed-consent",
});

// Helper function to get step index
const getStepIndex = (steps: Step[], stepPath: string): number => {
  return steps.findIndex(step => step.path === stepPath);
};

// Helper function to complete a step and all previous steps
const completeStepAndPrevious = (userState: UserStepState, stepPath: string): void => {
  const stepIndex = getStepIndex(userState.steps, stepPath);
  if (stepIndex === -1) return;

  const timestamp = new Date().toISOString();
  
  // Complete all steps up to and including the target step
  for (let i = 0; i <= stepIndex; i++) {
    if (!userState.steps[i].isCompleted) {
      userState.steps[i].isCompleted = true;
      userState.steps[i].completedAt = timestamp;
    }
  }
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
    
    // Mark a step as incomplete for current user
    uncompleteStep: (state, action: PayloadAction<string>) => {
      const stepPath = action.payload;
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      const step = userState.steps.find(s => s.path === stepPath);
      if (step) {
        step.isCompleted = false;
        step.completedAt = undefined;
      }
    },
    
    // Set the current active step for current user
    setCurrentStep: (state, action: PayloadAction<string>) => {
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      state.userStates[currentUserId].currentStep = action.payload;
    },
    
    // Reset all steps for current user
    resetAllSteps: (state) => {
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      userState.steps.forEach(step => {
        step.isCompleted = false;
        step.completedAt = undefined;
      });
      userState.currentStep = "/informed-consent";
    },
    
    // Complete multiple steps at once for current user
    completeMultipleSteps: (state, action: PayloadAction<string[]>) => {
      const stepPaths = action.payload;
      const currentUserId = state.currentUserId;
      
      if (!currentUserId || !state.userStates[currentUserId]) return;
      
      const userState = state.userStates[currentUserId];
      const timestamp = new Date().toISOString(); // Single timestamp for all
      stepPaths.forEach(stepPath => {
        const step = userState.steps.find(s => s.path === stepPath);
        if (step && !step.isCompleted) {
          step.isCompleted = true;
          step.completedAt = timestamp;
        }
      });
    }
  },
});

// Export actions
export const { 
  setCurrentUser,
  completeStep, 
  autoCompletePreviousSteps, // New action
  uncompleteStep, 
  setCurrentStep, 
  resetAllSteps, 
  completeMultipleSteps 
} = stepSlice.actions;

// Base selectors
const selectStepState = (state: { steps: StepState }) => state.steps;
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
  (userState): string => {
    return userState ? userState.currentStep : "/informed-consent";
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
    return Math.round((completed / userState.steps.length) * 100);
  }
);

// Export the current user ID selector
export { selectCurrentUserId };

// Export the reducer
export default stepSlice.reducer;