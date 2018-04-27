import React from 'react';
import {render} from 'react-dom';
import Resources from './components/Resources';
import Experiments from './components/Experiments';
import {} from './scripts/experiments';
import {} from './scripts/menu';

render(<Resources />, document.getElementById('page-brainfuel'));
render(<Experiments />, document.getElementById('page-experiments'));
