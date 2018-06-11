import React from 'react';
import PropTypes from 'prop-types';
import Experiment from '../components/Experiment.js';

/**
 * Experiment list component
 * State:
 * - experiments
 * @todo Create an API to store & retrieve experiments data.
 * @extends React.Component
 */
class Experiments extends React.Component {
    constructor() {
        super();
        this.state = {
            experiments: require('../../data/experiments.json')
        }
    }
    render() {
        let { experiments } = this.state;
        return (
            <div>
                <div className="filter-experiments-container">
                    <p>There&apos;s a total of <strong>{Object.keys(experiments).length} experiment(s)</strong>, wow!</p>
                </div>
                <div className="experiments-container">
                    {renderExperimentList(experiments)}
                </div>
            </div>
        );
    }
    renderExperimentList(experiments) {
        const count = Object.keys(experiments).length;
        return Object.keys(experiments).sort().reverse().map((experimentId, i) =>
            <Experiment key={experimentId} num={count - i} collapsed={i > 0} {...(experiments[experimentId])} />
        );
    }
};

Experiments.propTypes = {
    experiments: PropTypes.object
};

module.exports = Experiments;
