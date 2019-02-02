import styled from 'styled-components'
import { media } from '../components/MediaQueries.jsx';

const Page = styled.section `
  border-bottom: 1px solid #c1b79a;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 1em;
  ${media.medium `
      padding: 3em 1em;
  `}
`

export default Page
