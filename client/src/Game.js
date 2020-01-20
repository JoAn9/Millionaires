import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [questionData, setQuestionData] = useState({
    question: '',
    answers: [],
  });
  const [goodAns, setGoodAnswers] = useState('');
  const [gameOver, setGameOver] = useState('');
  const [tipFromFriend, setTipFromFriend] = useState('');

  const { question, answers } = questionData;

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('/question');
      console.log(res);
      const {
        data: { question, answers, winner, loser },
      } = res;
      if (winner) {
        setGameOver('WE ARE THE CHAMPIONS!!!');
      }
      if (loser) {
        setGameOver('YOU LOST, SORRY :(');
      }
      setQuestionData({ question, answers });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswersFeedback = data => {
    console.log(data);
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
    const res = axios.get('/help/friend');
    const {
      data: { text },
    } = await res;
    console.log(text);
    setTipFromFriend(text);
  };

  const fiftyFifty = async () => {
    const res = axios.get('/help/fifty');
    const {
      data: { wrongAnswers },
    } = await res;
    console.log(wrongAnswers);
    // setTipFromFriend(text);
  };

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
      <h3>{gameOver}</h3>
      <button onClick={phoneAFriend}>Phone a Friend</button>
      <button onClick={fiftyFifty}>Fifty-Fifty</button>
      <button>Ask the Audience</button>
      {tipFromFriend && <h2>{tipFromFriend}</h2>}
    </Fragment>
  );
}

export default Game;
