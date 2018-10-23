import * as React from "react";
import styled from "styled-components";
import { match as Match } from "react-router-dom";

const Title = styled.h1`
  color: red;
`;

export default class About extends React.Component<{}> {
  public static path = "/about";
  public static getInitialProps(match: Match) {
    return Promise.resolve({ data: null });
  }
  public render() {
    return (
      <div>
        <Title>About</Title>
      </div>
    );
  }
}
