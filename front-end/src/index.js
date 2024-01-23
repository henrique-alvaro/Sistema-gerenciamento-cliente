import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


// Substitua ReactDOM.render pelo createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
