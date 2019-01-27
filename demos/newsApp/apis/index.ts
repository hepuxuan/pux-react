import fetch = require("isomorphic-fetch");

function getNews(newsType: string) {
  return fetch(
    `https://newsapi.org/v2/everything?q=${newsType}&sortBy=publishedAt&apiKey=e46c072e55ff446eb98bebcdae3d3a54`
  ).then(res => res.json());
}

export default {
  getNews
};
