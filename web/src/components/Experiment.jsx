import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import { media } from "../components/MediaQueries.jsx";
import { A, Ul, H1, P } from "../components/BaseStyledComponents.jsx";

const ExperimentArticle = styled.article`
  padding: 0;
  border-radius: 10px 10px 0 0;
  border: 1px solid #a39f9c;
  background: #c1b79a;
  flex-direction: column;
  margin: 2px;
  max-width: 1400px;
  display: flex;
  & > * {
    padding: 0;
  }
`;

const ExperimentHeaderSection = styled.section.attrs((props) => ({
  collapsed: props.collapsed || false,
}))`
  padding: 2px 12px;
  cursor: pointer;
  background: #333;
  border-radius: 10px 10px 0 0;
  line-height: 2;
  color: ${(props) => (props.collapsed ? "#c1b79a" : "#ddd")};
  &:hover {
    color: #ddd;
  }
`;

const ExperimentHeader = styled.header`
  display: flex;
  justify-content: space-between;
`;

const ExperimentTitle = styled(H1).attrs((props) => ({
  collapsed: props.collapsed || false,
}))`
  font-size: 1.2rem;
  font-weight: ${(props) => (props.collapsed ? "normal" : "bold")};
  margin: 0;
`;

const ExperimentStatus = styled.span.attrs((props) => ({
  status: props.status || "planned",
}))`
  font-size: 1.2rem;
  color: ${(props) =>
    props.status === "done"
      ? "green"
      : props.status === "on-going"
        ? "yellow"
        : "grey"};
`;

const uncollapsebody = keyframes`
  from {
      max-height: 0;
  }
  to {
      max-height: 1000px;
  }
`;
const collapsebody = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0;
  }
`;

const ExperimentBody = styled.div.attrs((props) => ({
  collapsed: props.collapsed || false,
}))`
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  overflow-y: hidden;
  animation-duration: 300ms;
  animation-name: ${(props) =>
    props.collapsed ? collapsebody : uncollapsebody};
  animation-iteration-count: 1;
  animation-direction: normal;
  ${(props) => (props.collapsed ? "max-height: 0" : "")};
`;

const ExperimentBodyList = styled(Ul)`
  padding: 0 0 0 1em;
`;

const ExperimentResourcesUl = styled(ExperimentBodyList)`
  list-style: none;
`;

const ExperimentResultsUl = styled(ExperimentBodyList)`
  list-style: none;
  display: inline-flex;
  flex-direction: row;
  vertical-align: bottom;
`;

const ExperimentContentSection = styled.section`
  padding: 0;
  flex: 2 2 100%;
  ${media.large`
      flex: 1 50%;
  `}
`;

const ExperimentResourcesSection = styled.section`
  padding: 0;
  flex: 2 2 100%;
  ${media.large`
      flex: 1 50%;
  `}
`;

const ExperimentResultsSection = styled.section`
  display: flex;
  flex: 2 2 100%;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;

const ExperimentSectionTitle = styled.p`
  margin: 0;
  font-weight: bold;
  padding: 0.25em 0.5em;
  background: #b4aa8f;
`;

const ExperimentSectionIcon = styled.span`
  margin-right: 0.25em;
`;

const ExperimentTagsSection = styled.section`
  background: #b4aa8f;
  padding: 0.25em 0.5em;
`;

/**
 * Stateless component displaying a Fellowseb'lab Experiment.
 * @param {object} props Properties.
 */
const Experiment = ({
  tasks = [],
  resources = [],
  results = [],
  tags = [],
  collapsed = true,
  num = 0,
  title = "[Unknown experiment]",
  onToggleCollapse = null,
  status = "planned",
}) => {
  return (
    <ExperimentArticle>
      <ExperimentHeaderSection collapsed={collapsed} onClick={onToggleCollapse}>
        <ExperimentHeader>
          <ExperimentTitle collapsed={collapsed}>
            {num} - {title}
          </ExperimentTitle>
          <ExperimentStatus status={status}>
            {renderExperimentStatus(status)}
          </ExperimentStatus>
        </ExperimentHeader>
      </ExperimentHeaderSection>
      <ExperimentBody collapsed={collapsed}>
        <ExperimentContentSection>
          <ExperimentSectionTitle>
            <ExperimentSectionIcon className="fas fa-tasks" title="Tasks" />I
            used...
          </ExperimentSectionTitle>
          {renderExperimentTasks(tasks)}
        </ExperimentContentSection>
        <ExperimentResourcesSection>
          <ExperimentSectionTitle>
            <ExperimentSectionIcon className="fas fa-link" title="Resources" />
            Resources
          </ExperimentSectionTitle>
          {renderExperimentResources(resources)}
        </ExperimentResourcesSection>
        <ExperimentResultsSection>
          <ExperimentSectionTitle>
            <ExperimentSectionIcon
              className="fas fa-chart-line"
              title="Results"
            />
            Results
          </ExperimentSectionTitle>
          {renderExperimentResults(results)}
        </ExperimentResultsSection>
      </ExperimentBody>
      <ExperimentTagsSection>
        <ExperimentSectionIcon className="fas fa-tags" title="Tags" />
        {renderExperimentTags(tags)}
      </ExperimentTagsSection>
    </ExperimentArticle>
  );
};

Experiment.propTypes = {
  num: PropTypes.number.isRequired,
  collapsed: PropTypes.bool,
  title: PropTypes.string,
  tasks: PropTypes.array,
  resources: PropTypes.array,
  results: PropTypes.array,
  tags: PropTypes.array,
  onToggleCollapse: PropTypes.func,
  status: PropTypes.string,
};

const renderExperimentTasks = (tasks) => (
  <ExperimentBodyList>
    {tasks.map((task, i) => (
      <li key={i}>{task}</li>
    ))}
  </ExperimentBodyList>
);

const renderBook = (book, index) => {
  const authors = book.authors[0];
  return (
    <li key={index} className="experiment-resource experiment-resource-book">
      <P>
        <ExperimentSectionIcon className="fas fa-book" title="Book" />
        <A target="_blank" rel="noopener noreferrer" href={book.href}>
          {book.title}
        </A>
        <br />
        ed {book.editor}, ISBN{book.isbn}
        <br />
        by {authors}
      </P>
    </li>
  );
};

const renderArticle = (article, index) => {
  const authors = article.authors[0];
  return (
    <li key={index} className="experiment-resource experiment-resource-article">
      <P>
        <ExperimentSectionIcon className="fas fa-bookmark" title="Article" />
        <A target="_blank" rel="noopener noreferrer" href={article.href}>
          {article.title}
        </A>
        <br />
        by {authors}
      </P>
    </li>
  );
};

const renderExperimentResources = (resources) => (
  <ExperimentResourcesUl>
    {resources.map((resource, i) => {
      switch (resource.type) {
        case "book":
          return renderBook(resource, i);
        case "article":
          return renderArticle(resource, i);
      }
    })}
  </ExperimentResourcesUl>
);

const ExperimentResultsItem = styled.li`
  margin-right: 2px;
  padding: 0 4px;
  text-decoration: underline;
  border-right: 1px solid #ddd;
  &:last-of-type {
    border-right: none;
  }
`;

const renderExperimentResults = (results) => (
  <ExperimentResultsUl>
    {results.map((result, i) => (
      <ExperimentResultsItem key={i}>
        <A href={result.href} target="_blank" rel="noopener noreferrer">
          {result.text}
        </A>
      </ExperimentResultsItem>
    ))}
  </ExperimentResultsUl>
);

const ExperimentTagsUl = styled(ExperimentBodyList)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: inline-block;
  vertical-align: bottom;
`;

const ExperimentTagsItem = styled.li`
  background-color: #d7b61b;
  float: left;
  padding: 4px;
  margin: 2px 2px 0 0;
  line-height: 1;
  font-style: italic;
  font-size: 0.9em;
  color: #333;
  font-weight: bold;
`;

const renderExperimentTags = (tags) => (
  <ExperimentTagsUl>
    {tags.map((tag, i) => (
      <ExperimentTagsItem key={i}>{tag}</ExperimentTagsItem>
    ))}
  </ExperimentTagsUl>
);

const renderExperimentStatus = (status) => {
  switch (status) {
    case "done":
      return "DONE";
    case "ongoing":
      return "ON-GOING";
    case "planned":
      return "PLANNED";
  }
};

export default Experiment;
