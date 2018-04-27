import React from 'react';
import PropTypes from 'prop-types';
import Experiment from '../components/Experiment.js';
import {experiments} from '../../data/experiments.json';

const Experiments = () => {
    const renderedExperiments = renderExperimentList(experiments);
    return <div>
        <div className="filter-experiments-container">
            <p>There&apos;s a total of <strong>{experiments.length} experiment(s)</strong>, wow!</p>
        </div>
        <div className="experiments-container">
            {renderedExperiments}
        </div>
    </div>;
};

Experiments.propTypes = {
    experiments: PropTypes.array
};

const renderExperimentList = experiments =>
    experiments.reverse().map((experiment, i) =>
        <Experiment key={i} num={experiments.length - i} collapsed={i > 0} {...experiment}/>);

module.exports = Experiments;
