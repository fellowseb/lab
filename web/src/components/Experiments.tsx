import { useCallback, useState } from "react";
import styled from "styled-components";

import { P, Strong } from "../components/BaseStyledComponents.tsx";
import Experiment from "../components/Experiment.tsx";

import EXPERIMENTS_DATA from "../../data/experiments.json";
import type { ExperimentsModel } from "./types.ts";

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

interface ExperimentsState {
  experiments: ExperimentsModel;
}

/**
 * Experiment list component
 * State:
 * - experiments
 * @todo Create an API to store & retrieve experiments data.
 * @extends React.PureComponent
 */
const Experiments = () => {
  const [state, setState] = useState<ExperimentsState>({
    experiments: EXPERIMENTS_DATA as unknown as ExperimentsModel,
  });
  const { experiments } = state;
  const onToggleCollapse = useCallback(
    (experimentId: string) => {
      experiments[experimentId].collapsed =
        !experiments[experimentId].collapsed;
      setState({
        experiments,
      });
    },
    [experiments, setState],
  );
  const renderExperiment = (
    experiments: ExperimentsModel,
    experimentId: string,
    index: number,
  ) => {
    const count = Object.keys(experiments).length;
    return (
      <Experiment
        key={experimentId}
        num={count - index}
        onToggleCollapse={onToggleCollapse.bind(null, experimentId)}
        {...experiments[experimentId]}
      />
    );
  };
  const renderExperimentList = (experiments: ExperimentsModel) => {
    return Object.keys(experiments)
      .sort()
      .reverse()
      .map((experimentId, i) => renderExperiment(experiments, experimentId, i));
  };
  return (
    <div>
      <FilterExperimentsContainer>
        <P>
          There&apos;s a total of{" "}
          <Strong>{Object.keys(experiments).length} experiment(s)</Strong>, wow!
        </P>
      </FilterExperimentsContainer>
      <ExperimentsContainer>
        {renderExperimentList(experiments)}
      </ExperimentsContainer>
    </div>
  );
};

export default Experiments;
