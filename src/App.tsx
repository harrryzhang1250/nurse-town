import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mantine/core';
import TopBar from './TopBar';
import Sidebar from './MainApp/SideBar';
import InformedConsent from './MainApp/StepContents/InformedConsent';
import PreSurvey from './MainApp/StepContents/PreSurvey';
import SignUpStudy from './MainApp/StepContents/SignUpStudy';
import PostSurvey from './MainApp/StepContents/PostSurvey';
import SignUpInterview from './MainApp/StepContents/SignUpInterview';
import { selectAllSteps, selectCompletedStepPaths, setCurrentStep, setCurrentUser } from './reducer';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import type { RootState } from './store';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const steps = useSelector((state: RootState) => selectAllSteps(state));
  const completedStepPaths = useSelector((state: RootState) => selectCompletedStepPaths(state));

  const { user, signOut } = useAuthenticator();

  // Set current user in Redux when user changes
  useEffect(() => {
    if (user?.username) {
      dispatch(setCurrentUser(user.username));
    }
  }, [user?.username, dispatch]);

  // Update current step when route changes
  useEffect(() => {
    dispatch(setCurrentStep(location.pathname));
  }, [location.pathname, dispatch]);

  // handle page refesh
  useEffect(() => {
    navigate('/informed-consent');
  }, []);

  // // Handle page refresh - auto-complete previous steps based on current route
  // useEffect(() => {
  //   // Only run this logic if user is set and steps are available
  //   if (user?.username && steps.length > 0) {
      
  //     // Auto-complete all previous steps based on current route
  //     dispatch(autoCompletePreviousSteps(location.pathname));
      
  //     // Set current step
  //     dispatch(setCurrentStep(location.pathname));
  //   }
  // }, [user?.username, steps.length, location.pathname, dispatch]); // Simplified dependencies
  
  function AppRoutes() {
    return (
      <Box 
        style={{ 
        background: '#f8f9fa', 
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <TopBar signOut={signOut} user={user} />
      <Sidebar
        steps={steps.map(step => ({ name: step.name, path: step.path }))}
        completedSteps={completedStepPaths}
      />
      <Box
        style={{
          marginLeft: '250px', // Account for sidebar width
          minHeight: '100vh',
          width: 'calc(100vw - 250px)', // Full width minus sidebar
          background: 'white',
          boxSizing: 'border-box'
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/informed-consent" replace />} />
          <Route path="/informed-consent" element={<InformedConsent />} />  
          <Route path="/pre-survey" element={<PreSurvey />} />
          <Route path="/sign-up-study" element={<SignUpStudy />} />
          <Route path="/post-survey" element={<PostSurvey />} />
          <Route path="/sign-up-interview" element={<SignUpInterview />} />
        </Routes>
        </Box>
      </Box>
    );
  }

  return (
    <Authenticator>
      <AppRoutes />
    </Authenticator>
  );
}

export default App;
