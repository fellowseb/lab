import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

let apiUrl = FELLOWSEBLAB_API_URL;
//let apiUrl = 'http://localhost/api';
render(<App apiUrl={apiUrl} win={window}/>, document.getElementById('app-container'));
