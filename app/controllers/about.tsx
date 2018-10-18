import * as React from "react";
import styled from "styled-components";

const Title = styled.h1`
  color: red;
`;

export default class About extends React.Component<{}> {
  public static path = "/about";
  public static resolve() {
    return Promise.resolve({});
  }
  public render() {
    return (
      <div>
        <Title>About</Title>
      </div>
    );
  }
}
