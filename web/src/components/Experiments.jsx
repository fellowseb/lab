import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { P, Strong } from '../components/BaseStyledComponents.jsx';
import Experiment from '../components/Experiment.jsx';

const FilterExperimentsContainer = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
`;

const ExperimentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  > * {
      flex: 1 1 50%;
  }
`;

/**
 * Experiment list component
 * State:
 * - experiments
 * @todo Create an API to store & retrieve experiments data.
 * @extends React.PureComponent
 */
class Experiments extends React.Component {
    constructor() {
        super();
        this.state = {
            experiments: require('../../data/experiments.json')
        };
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.renderExperiment = this.renderExperiment.bind(this);
        this.renderExperimentList = this.renderExperimentList.bind(this);
    }
    onToggleCollapse(experimentId) {
        let experiments = this.state.experiments;
        experiments[experimentId].collapsed = !(experiments[experimentId].collapsed);
        this.setState({
            experiments
        });
    }
    render() {
        const { experiments } = this.state;
        const { renderExperimentList } = this;
        return (
            <div>
                <FilterExperimentsContainer>
                    <P>There&apos;s a total of <Strong>{Object.keys(experiments).length} experiment(s)</Strong>, wow!</P>
                </FilterExperimentsContainer>
                <ExperimentsContainer>
                    {renderExperimentList(experiments)}
                </ExperimentsContainer>
            </div>
        );
    }
    renderExperimentList(experiments) {
        const { renderExperiment } = this;
        return Object.keys(experiments).sort().reverse().map((experimentId, i) =>
            renderExperiment(experiments, experimentId, i)
        );
    }
    renderExperiment(experiments, experimentId, index) {
        const { onToggleCollapse } = this;
        const count = Object.keys(experiments).length;
        return <Experiment key={experimentId} num={count - index} onToggleCollapse={onToggleCollapse.bind(null, experimentId)} {...(experiments[experimentId])} />;
    }
}

Experiments.propTypes = {
    experiments: PropTypes.object
};

module.exports = Experiments;
