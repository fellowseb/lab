import styled, { keyframes } from "styled-components";

import { Ul, H1 } from "../components/BaseStyledComponents.tsx";
import type { ExperimentStatusModel } from "./types.ts";
import { useCallback } from "react";

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

const ExperimentHeaderSection = styled.section<{
  $collapsed: boolean;
}>`
  padding: 2px 12px;
  cursor: pointer;
  background: #333;
  border-radius: 10px 10px 0 0;
  line-height: 2;
  color: ${(props) => (props.$collapsed ? "#c1b79a" : "#ddd")};
  &:hover {
    color: #ddd;
  }
`;

const ExperimentHeader = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ExperimentTitle = styled(H1)<{
  $collapsed: boolean;
}>`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: ${(props) => (props.$collapsed ? "normal" : "bold")};
  margin: 0;
`;

const ExperimentStatus = styled.span<{
  $status: ExperimentStatusModel;
}>`
  text-align: right;
  font-size: 0.7rem;
  color: ${(props) =>
    props.$status === "done"
      ? "#91d82d"
      : props.$status === "on-going"
        ? "#14c0ff"
        : "grey"};
`;

const ExperimentDate = styled.span`
  text-align: left;
  font-size: 0.7rem;
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

const ExperimentBody = styled.div<{
  $collapsed: boolean;
}>`
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: hidden;
  animation-duration: 300ms;
  animation-name: ${(props) =>
    props.$collapsed ? collapsebody : uncollapsebody};
  animation-iteration-count: 1;
  animation-direction: normal;
  ${(props) => (props.$collapsed ? "max-height: 0" : "")};
  padding: 0 8px 0 8px;

  & h2 {
    font-size: 1em;
  }

  & a {
    color: black;
    text-decoration: underline;
  }
`;

const ExperimentBodyList = styled(Ul)`
  padding: 0 0 0 1em;
`;

const ExperimentSectionIcon = styled.span`
  margin-right: 0.25em;
`;

const ExperimentTagsSection = styled.section`
  background: #b4aa8f;
  padding: 0.25em 0.5em;
`;

const ExperimentMetadata = styled.div`
  min-width: 70px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

interface ExperimentProps {
  id: string;
  content: string;
  collapsed?: boolean;
  title?: string;
  tags: string[];
  onToggleCollapse?: (experimentId: string) => void;
  status: ExperimentStatusModel;
  date: string;
}

function unEscape(htmlStr: string) {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
}

/**
 * Stateless component displaying a Fellowseb'lab Experiment.
 * @param {object} props Properties.
 */
const Experiment = ({
  id,
  content = "",
  tags = [],
  collapsed = true,
  title = "[Unknown experiment]",
  onToggleCollapse = undefined,
  status = "planned",
  date,
}: ExperimentProps) => {
  const onExperimentToggleCollapse = useCallback(() => {
    onToggleCollapse?.(id);
  }, [id, onToggleCollapse]);
  return (
    <ExperimentArticle>
      <ExperimentHeaderSection
        $collapsed={collapsed}
        onClick={onExperimentToggleCollapse}
      >
        <ExperimentHeader>
          <ExperimentMetadata>
            <ExperimentDate>{date}</ExperimentDate>
            <ExperimentStatus $status={status}>
              {renderExperimentStatus(status)}
            </ExperimentStatus>
          </ExperimentMetadata>
          <ExperimentTitle $collapsed={collapsed}>{title}</ExperimentTitle>
        </ExperimentHeader>
      </ExperimentHeaderSection>
      <ExperimentBody
        $collapsed={collapsed}
        dangerouslySetInnerHTML={{ __html: unEscape(content) }}
      ></ExperimentBody>
      <ExperimentTagsSection>
        <ExperimentSectionIcon className="fas fa-tags" title="Tags" />
        {renderExperimentTags(tags)}
      </ExperimentTagsSection>
    </ExperimentArticle>
  );
};

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

const renderExperimentTags = (tags: string[]) => (
  <ExperimentTagsUl>
    {tags.map((tag, i) => (
      <ExperimentTagsItem key={i}>{tag}</ExperimentTagsItem>
    ))}
  </ExperimentTagsUl>
);

const renderExperimentStatus = (status: ExperimentStatusModel) => {
  switch (status) {
    case "done":
      return "DONE";
    case "on-going":
      return "ON-GOING";
    case "planned":
      return "PLANNED";
  }
};

export default Experiment;
