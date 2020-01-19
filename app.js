const express = require('express');
const path = require('path');
const gameRoutes = require('./routes/game');

const app = express();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

app.use(express.static(path.join(__dirname, 'client/public')));

gameRoutes(app);
