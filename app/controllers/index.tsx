import * as React from "react";
import styled from "styled-components";
import { proxy } from "../../lib/pux/proxy";
import fetch = require("isomorphic-fetch");
import { match as Match, Link } from "react-router-dom";
const fs = require("fs");
const path = require("path");

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

  public state: {
    testData: any;
  } = {
    testData: null
  };

  @proxy
  public static getFile() {
    return Promise.resolve(
      JSON.parse(
        // Yes you can invoke node api in reactJS!!!
        fs
          .readFileSync(path.resolve(__dirname, "../../../test.json"))
          .toString()
      )
    );
  }

  @proxy
  public static getNews(newsType: string) {
    return fetch(
      `https://newsapi.org/v2/everything?q=${newsType}&from=2018-10-18&sortBy=publishedAt&apiKey=e46c072e55ff446eb98bebcdae3d3a54`
    ).then(res => res.json());
  }

  public static getInitialProps(match: Match) {
    return Index.getNews((match.params as any).news).then(data => ({ data }));
  }

  public componentDidMount() {
    Index.getFile().then(data => {
      this.setState({
        testData: data
      });
    });
  }

  public render() {
    return (
      <div>
        <div>
          {this.state.testData
            ? `this is from test.json file: ${this.state.testData.message}`
            : null}
        </div>
        <div>
          <Link to="/tech">tech</Link>
          &nbsp;
          <Link to="/sport">sport</Link>
        </div>
        <Title>News</Title>
        {this.props.data.articles.map(({ content, title }, index) => (
          <div key={index}>
            <h4>{title}</h4>
            <p key={title}>{content}</p>
          </div>
        ))}
      </div>
    );
  }
}
