// utils/sentiment.js
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyzeReview(text) {
  const result = sentiment.analyze(text);
  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative
  };
}

module.exports = analyzeReview;
