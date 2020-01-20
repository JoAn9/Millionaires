function gameRoutes(app) {
  let goodAnswers = 0;
  let isGameOver = false;
  let callToAFriendUsed = false;

  const questions = [
    {
      question: 'What is the best programming language?',
      answers: ['C#', 'JavaScript', 'Java', 'Haskell'],
      correctAnswer: 1,
    },
    {
      question: 'What would you like to drink?',
      answers: ['Water please', 'Nothing', 'Orange juice', 'Glass of wine'],
      correctAnswer: 3,
    },
    {
      question: 'Pizza?',
      answers: ['Even two', 'No thanks', 'I prefer broccoli', ' I am on diet'],
      correctAnswer: 0,
    },
  ];

  app.get('/question', (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true,
      });
    } else if (isGameOver) {
      res.json({
        loser: true,
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      const { question, answers } = nextQuestion;

      res.json({ question, answers });
    }
  });

  app.post('/answer/:index', (req, res) => {
    const { index } = req.params;
    const isCorrect = Number(index) === questions[goodAnswers].correctAnswer;

    if (isGameOver) {
      res.json({
        loser: true,
      });
    }
    if (isCorrect) {
      goodAnswers++;
    } else {
      isGameOver = true;
    }

    res.json({
      correct: isCorrect,
      goodAnswers,
    });
  });

  app.get('/help/friend', (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: 'Lifebet alredy used',
      });
    }

    const friendKnowsAnswer = Math.random() < 0.5;
    const question = questions[goodAnswers];
    const answer = question.answers[question.correctAnswer];

    res.json({
      text: friendKnowsAnswer
        ? `Hmm, I\'m not sure, but I think that answer is ${answer}`
        : "Hmm, I don't know...",
    });
    callToAFriendUsed = true;
  });
}

module.exports = gameRoutes;
