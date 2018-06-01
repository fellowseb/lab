import React from 'react';
import PropTypes from 'prop-types';
import Experiment from '../components/Experiment.js';

const Experiments = ({ experiments = {} }) => {
    const renderedExperiments = renderExperimentList(experiments);
    return (
        <div>
            <div className="filter-experiments-container">
                <p>There&apos;s a total of <strong>{Object.keys(experiments).length} experiment(s)</strong>, wow!</p>
            </div>
            <div className="experiments-container">
                {renderedExperiments}
            </div>
        </div>
    );
};

Experiments.propTypes = {
    experiments: PropTypes.object
};

const renderExperimentList = experiments => {
    const count = Object.keys(experiments).length;
    return Object.keys(experiments).sort().reverse().map((experimentId, i) =>
        <Experiment key={experimentId} num={count - i} collapsed={i > 0} {...(experiments[experimentId])} />
    );
};

module.exports = Experiments;
