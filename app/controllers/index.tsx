import * as React from "react";
import styled from "styled-components";
import { proxy } from "../../lib/proxy";
import fetch = require("isomorphic-fetch");
import { match as Match, Link } from "react-router-dom";

const Title = styled.h1`
  color: red;
`;

interface INews {
  title: string;
  content: string;
}

export default class Index extends React.Component<{
  data: {
    articles: INews[];
  };
}> {
  public static path = "/:news";

  @proxy
  public static resolve(match: Match) {
    return fetch(
      `https://newsapi.org/v2/everything?q=${
        (match.params as any).news
      }&from=2018-09-18&sortBy=publishedAt&apiKey=e46c072e55ff446eb98bebcdae3d3a54`
    ).then(res => res.json());
  }

  public render() {
    return (
      <div>
        <div>
          <Link to="/tech">tech</Link>
          &nbsp;
          <Link to="/sport">sport</Link>
        </div>
        <Title>News</Title>
        {this.props.data.articles.map(({ content, title }) => (
          <div key={title}>
            <h4>{title}</h4>
            <p key={title}>{content}</p>
          </div>
        ))}
      </div>
    );
  }
}
