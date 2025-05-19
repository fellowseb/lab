import styled from "styled-components";

import { A, Ul } from "../components/BaseStyledComponents.tsx";
import { media } from "../components/MediaQueries.tsx";

const ArticleItem = styled.li`
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  padding: 0 4px;
  &:last-child {
    border-bottom: none;
  }
`;

const ArticleItemPicture = styled.picture`
  display: none;
  ${media.medium`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 6rem;
      width: 6rem;
      float: left;
      margin: 0 2px 0 0;
      > img {
          max-width: 100%;
          max-height: 100%;
      }
  `}
`;

const ArticleTitle = styled(A)`
  display: block;
  text-decoration: none;
  font-weight: bold;
  max-height: 2.5em;
  overflow: hidden;
  overflow-wrap: break-word;
`;

const ArticleUrlAndAuthors = styled.div`
  display: block;
  font-size: 70%;
`;

const ArticleAuthors = styled.span`
  display: inline-block;
  padding-left: 0.5em;
`;

const ArticleTagsUl = styled(Ul)`
  font-size: 70%;
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 3px 0;
  padding: 0;
  flex-wrap: wrap;
`;

const ArticleTagsItem = styled.li`
  margin: 0 0.5em 0 0;
  padding: 0 4px 0 4px;
  color: #333333;
  background: #edc711;
`;

interface ResourceItemProps {
  title: string;
  url: string;
  tags: string[];
  authors: string[];
  defaultThumbnailClass: string;
  thumbnailUrl: string;
}

const ResourceItem = ({
  title = "[untitled article]",
  url = "",
  tags = [],
  authors = [],
  defaultThumbnailClass = "fa-bookmark",
}: ResourceItemProps) => {
  const defaultThumbnailClasses = "fas fa-4x " + defaultThumbnailClass;
  const authorsStr = authors.length ? authors[0] : "";
  return (
    <ArticleItem>
      <ArticleItemPicture
        className={defaultThumbnailClasses}
      ></ArticleItemPicture>
      <ArticleTitle href={url} target="_blank" rel="noopener">
        {title}
      </ArticleTitle>
      <ArticleUrlAndAuthors>
        <A href={url} target="_blank" rel="noopener">
          {domainFromURL(url)}
        </A>
        {authorsStr ? <ArticleAuthors> by {authors}</ArticleAuthors> : null}
      </ArticleUrlAndAuthors>
      <ArticleTagsUl>
        {tags.map((tag, tagIndex) => (
          <ArticleTagsItem key={tagIndex}>{tag}</ArticleTagsItem>
        ))}
      </ArticleTagsUl>
    </ArticleItem>
  );
};

function domainFromURL(url: string) {
  let result;
  let match = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im,
  );
  if (match) {
    result = match[1];
    match = result.match(/^[^.]+\.(.+\..+)$/);
    if (match) {
      result = match[1];
    }
  }
  return result;
}

export default ResourceItem;
