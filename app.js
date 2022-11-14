require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const authentication = require('./middlewares/authentication');
const usersRouter = require('./routes/users');
const photosRouter = require('./routes/photos');
const commetRouter = require('./routes/comment');
const socialMediaRouter = require('./routes/social_media');

app.get("/", async (req, res) => {
    res.status(200).json({'Final Project 4 Hacktiv8': {kelompok : 3}});
});
app.use('/users', usersRouter);

app.use(authentication);
app.use('/photos', photosRouter);
app.use('/comments', commetRouter);
app.use('/socialmedias', socialMediaRouter);


//app.listen(process.env.PORT, () => {
//  console.log(`App listening at http://localhost:${process.env.PORT}`);
//});

module.exports = app;