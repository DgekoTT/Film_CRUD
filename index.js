const express = require('express');
const filmRouter = require('./routes/film.routes');
const genreRouter = require("./routes/genre.routes");


const PORT = 3010;

const app = express();

app.listen(PORT, () => console.log(`started ${PORT}`));

app.use(express.json());
app.use('/api', filmRouter);
app.use('/api', genreRouter);

