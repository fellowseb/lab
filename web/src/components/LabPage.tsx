import Experiments from "./Experiments.tsx";
import Page from "./Page.tsx";
import CodeLabIconSvg from "/src/assets/images/svg/codelab.svg";

const LabPage = () => (
  <Page id="page-experiments" title="Code Lab" icon={<CodeLabIconSvg />}>
    <Experiments />
  </Page>
);

export default LabPage;
