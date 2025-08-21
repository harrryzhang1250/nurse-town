import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json'
import { Provider } from 'react-redux'
import { store } from './store'

const amplifyConfig = parseAmplifyConfig(outputs);

// Check if custom API configuration exists
const customAPI = (outputs as any).custom?.API || {};

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: customAPI,
  },
});

const components = {
  Header() {
    return (
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        marginTop: '8rem',
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
          Welcome to VOICE
        </h1>
      </div>
    );
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Authenticator components={components} loginMechanisms={['username']}>
            <App />
          </Authenticator>
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
)
