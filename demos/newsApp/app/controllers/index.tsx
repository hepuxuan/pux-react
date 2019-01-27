import * as React from "react";
import { injectApi, getInjectedApiMethod } from "pux-react";
import { match as Match, Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { parse } from "qs";

interface INews {
  title: string;
  content: string;
}

interface IProps extends RouteComponentProps {
  data: {
    articles: INews[];
  };
  getNews: (newsType: string) => Promise<any>;
}

const getNews = getInjectedApiMethod<(newsType: string) => Promise<any>>(
  "getNews"
);

class News extends React.Component<IProps> {
  public static path = "/news";
  public static title = "News";

  state = {
    data: this.props.data
  };

  public static getInitialProps(match: Match, query: any) {
    return getNews(query.q).then(data => ({ data }));
  }

  public componentWillUpdate(nextProps: IProps) {
    if (nextProps.location.search !== this.props.location.search) {
      // get api methods using props
      return this.props
        .getNews(
          parse(nextProps.location.search, { ignoreQueryPrefix: true }).q
        )
        .then(data => {
          this.setState({
            data
          });
        });
    }
  }

  public render() {
    return (
      <div>
        <div>
          <img width={50} src="/public/icon.jpg" alt="news" />
          <Link to="/news?q=tech">tech</Link>
          &nbsp;
          <Link to="/news?q=sport">sport</Link>
          &nbsp;
          <Link to="/about">about</Link>
        </div>
        <h1>News</h1>
        {this.state.data.articles.map(({ content, title }, index) => (
          <div key={index}>
            <h4>{title}</h4>
            <p key={title}>{content}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(injectApi("getNews")(News));
