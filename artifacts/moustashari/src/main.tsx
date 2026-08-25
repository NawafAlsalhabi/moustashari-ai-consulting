import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import App from './App';
import './index.css';

// Configure API client to attach the stored auth token to every request
setAuthTokenGetter(() => localStorage.getItem('moustashari_token'));

createRoot(document.getElementById('root')!).render(<App />);
