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

  app.post('/help/friend', (req, res) => {
    res.json({
      text: "Hmm, I don't know",
    });
  });
}

module.exports = gameRoutes;
