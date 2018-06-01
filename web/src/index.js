import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

let apiUrl = FELLOWSEBLAB_API_URL;
render(<App apiUrl={apiUrl} win={window}/>, document.getElementById('app-container'));
