import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [answersWithPercentages, setAnswersWithPercentages] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);

  const [goodAns, setGoodAnswers] = useState('');
  const [gameOver, setGameOver] = useState('');
  const [tip, setTip] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('/question');
      const {
        data: { question, answers, winner, loser },
      } = res;
      if (winner) {
        setGameOver('WE ARE THE CHAMPIONS!!!');
      }
      if (loser) {
        setGameOver('YOU LOST, SORRY :(');
      }
      setTip('');
      setQuestion(question);
      setAnswers(answers);
      setAllAnswers(answers);
      setAnswersWithPercentages([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswersFeedback = data => {
    setGoodAnswers(data);
    fetchQuestion();
  };

  const sendAnswer = async ans => {
    const res = await axios.post(`/answer/${ans}`);
    const {
      data: { goodAnswers },
    } = res;
    handleAnswersFeedback(goodAnswers);
  };

  const phoneAFriend = async () => {
    setTip('');
    const res = axios.get('/help/friend');
    const {
      data: { text },
    } = await res;
    setTip(text);
  };

  const fiftyFifty = async () => {
    setTip('');
    const res = axios.get('/help/fifty');
    const {
      data: { wrongAnswers, text },
    } = await res;
    if (wrongAnswers) {
      let answersFifty = [];
      for (const ans of answers) {
        if (wrongAnswers.includes(ans)) {
          answersFifty.push('--');
        } else {
          answersFifty.push(ans);
        }
      }
      setAnswers(answersFifty);
    }
    if (text) {
      setTip(text);
    }
  };

  // @todo: nice chart
  const askAudience = async () => {
    setTip('');
    const res = await axios.get('/help/audience');
    const {
      data: { results, text },
    } = res;
    if (text) {
      return setTip(text);
    }
    const answersWithAudience = [];

    allAnswers.forEach((item, i) => {
      answersWithAudience.push(`${item}: ${results[i]}%`);
    });

    setAnswersWithPercentages(answersWithAudience);
  };
  // @todo: block buttons after win & defeat
  return (
    <Fragment>
      <h2>
        Question<span></span>
      </h2>
      <h3>Good answers: {goodAns}</h3>
      <h3>{question}</h3>
      {answers?.map((item, index) => (
        <button key={index} onClick={() => sendAnswer(index)}>
          {item}
        </button>
      ))}
      {answersWithPercentages?.map(item => (
        <p key={item}>{item} </p>
      ))}
      <h3>{gameOver}</h3>
      <button onClick={phoneAFriend}>Phone a Friend</button>
      <button onClick={fiftyFifty}>Fifty-Fifty</button>
      <button onClick={askAudience}>Ask the Audience</button>
      {tip && <h2>{tip}</h2>}
    </Fragment>
  );
}

export default Game;
