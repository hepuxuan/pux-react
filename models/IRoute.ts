import { match as Match } from "react-router";

interface IRoute {
  component: React.ComponentType;
  path: string;
  getInitialProps?(match: Match): Promise<any>;
}

export { IRoute };
