import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

render(<App apiUrl={FELLOWSEBLAB_API_URL} win={window} />, document.getElementById('app-container'));
