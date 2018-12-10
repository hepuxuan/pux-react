import * as React from "react";
import { proxy } from "pux-react";
import fetch = require("isomorphic-fetch");
import { match as Match, Link } from "react-router-dom";

interface INews {
  title: string;
  content: string;
}

export default class News extends React.Component<{
  data: {
    articles: INews[];
  };
}> {
  public static path = "/news/:news";
  public static title = "News";

  @proxy
  public static getNews(newsType: string) {
    return fetch(
      `https://newsapi.org/v2/everything?q=${newsType}&sortBy=publishedAt&apiKey=e46c072e55ff446eb98bebcdae3d3a54`
    ).then(res => res.json());
  }

  public static getInitialProps(match: Match) {
    return News.getNews((match.params as any).news).then(data => {
      return { data };
    });
  }

  public render() {
    return (
      <div>
        <div>
          <img width={50} src="/public/icon.jpg" alt="news" />
          <Link to="/news/tech">tech</Link>
          &nbsp;
          <Link to="/news/sport">sport</Link>
          &nbsp;
          <Link to="/about">about</Link>
        </div>
        <h1>News</h1>
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
