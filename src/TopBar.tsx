import { Group, Button, Text, Box } from '@mantine/core';
import { AuthUser } from 'aws-amplify/auth';

interface TopBarProps {
  signOut: () => void;
  user?: AuthUser;
}

function TopBar({ signOut, user }: TopBarProps) {

  return (
    <Box
      style={{
        height: '50px',
        background: '#4f46e5',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <Text
        size="lg"
        fw={600}
        c="white"
      >
        User Study Portal
      </Text>
      
      <Group gap="md">
        {user && (
          <Text
            size="sm"
            c="white"
            fw={500}
          >
            Welcome, {user.signInDetails?.loginId || user.username || 'User'}
          </Text>
        )}
        <Button
          variant="filled"
          color="white"
          c="#4f46e5"
          size="sm"
          onClick={signOut}
          style={{
            backgroundColor: 'white',
            color: '#4f46e5',
            border: 'none'
          }}
        >
          Sign Out
        </Button>
      </Group>
    </Box>
  );
}

export default TopBar;
