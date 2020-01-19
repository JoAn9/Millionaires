import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Question() {
  const [questionData, setQuestionData] = useState({
    question: '',
    answers: [],
  });

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

  const sendAnswer = ans => {
    axios.post(`/answer/${ans}`);
  };

  return (
    <Fragment>
      <h2>
        Question<span></span>
      </h2>
      <h3>{question}</h3>
      {answers?.map((item, index) => (
        <button key={index} onClick={() => sendAnswer(index)}>
          {item}
        </button>
      ))}
    </Fragment>
  );
}

export default Question;
