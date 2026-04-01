import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// 1. Get the root element
const rootElement = document.getElementById('root');

// 2. Add a null check to satisfy TypeScript's strict mode
if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure there is a <div id='root'></div> in your index.html");
}

// 3. Create the root and render
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);