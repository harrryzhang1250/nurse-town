import { Box, Stack } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import StepItem from './StepItem';

interface SidebarProps {
  steps: Array<{
    name: string;
    path: string;
  }>;
  completedSteps: string[];
}

function Sidebar({ steps, completedSteps }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      style={{
        width: '250px',
        background: '#f3f4f6',
        padding: '20px',
        boxShadow: '1px 0 4px rgba(0, 0, 0, 0.1)',
        height: 'calc(100vh - 50px)', // Account for TopBar height
        position: 'fixed',
        top: '50px',
        left: 0,
        overflowY: 'auto'
      }}
    >
      {/* Progress Indicator */}
      <ProgressIndicator />
      
      <Stack gap="md">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.path);
          const isClickable =
            index === 0 || completedSteps.includes(steps[index - 1].path) || isCompleted;
          const isSelected = location.pathname === step.path; // Current page location
          
          // Find the next step to complete (first incomplete step)
          const nextStepToComplete = steps.find((s) => !completedSteps.includes(s.path));
          const isActive = nextStepToComplete ? nextStepToComplete.path === step.path : false;

          return (
            <StepItem
              key={index}
              step={step}
              stepNumber={index + 1}
              isCompleted={isCompleted}
              isClickable={isClickable}
              isActive={isActive}
              isSelected={isSelected}
              onClick={() => {
                if (isClickable) navigate(step.path);
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default Sidebar;
