function gameRoutes(app) {
  let goodAnswers = 0;
  let isGameOver = false;
  let phoneAFriendUsed = false;
  let fiftyFiftyUsed = false;
  let askAudienceUsed = false;

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
    if (phoneAFriendUsed) {
      return res.json({
        text: 'Lifeline "Phone a friend" alredy used',
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
    phoneAFriendUsed = true;
  });

  app.get('/help/fifty', (req, res) => {
    if (fiftyFiftyUsed) {
      return res.json({
        text: 'Lifeline "Fifty-fifty" alredy used',
      });
    }
    const question = questions[goodAnswers];
    const wrongAnswers = question.answers.filter(
      (item, index) => index !== question.correctAnswer
    );
    const randomIndex = ~~(Math.random() * wrongAnswers.length);

    wrongAnswers.splice(randomIndex, 1);

    res.json({
      wrongAnswers,
    });

    fiftyFiftyUsed = true;
  });

  app.get('/help/audience', (req, res) => {
    if (askAudienceUsed) {
      return res.json({
        text: 'Lifeline "Ask the Audience" alredy used',
      });
    }
    const results = [10, 20, 32, 38];
    for (let i = results.length - 1; i > 0; i--) {
      const randomNumber = Math.floor(Math.random() * 20 - 10);
      results[i] += randomNumber;
      results[i - 1] -= randomNumber;
    }
    const correctAnswer = questions[goodAnswers].correctAnswer;

    [results[correctAnswer], results[3]] = [results[3], results[correctAnswer]];

    res.json({ results });
    askAudienceUsed = true;
  });
}

module.exports = gameRoutes;
