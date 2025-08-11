import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const components = {
  Header() {
    return (
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '0',
          background: 'Black',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to Nurse Town
        </h1>
      </div>
    );
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator components={components}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </Authenticator>
  </React.StrictMode>
);
