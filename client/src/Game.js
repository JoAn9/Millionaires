import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [questionData, setQuestionData] = useState({
    question: '',
    answers: [],
  });
  const [goodAns, setGoodAnswers] = useState('');

  const { question, answers } = questionData;

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await axios.get('/question');
        console.log(res);
        const {
          data: { question, answers },
        } = res;
        setQuestionData({ question, answers });
      } catch (err) {
        console.log(err);
      }
    }
    fetchQuestion();
  }, []);

  const handleAnswersFeedback = data => {
    console.log(data);
    setGoodAnswers(data);
  };

  const sendAnswer = async ans => {
    const res = await axios.post(`/answer/${ans}`);
    const {
      data: { goodAnswers },
    } = res;
    handleAnswersFeedback(goodAnswers);
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
    </Fragment>
  );
}

export default Game;
