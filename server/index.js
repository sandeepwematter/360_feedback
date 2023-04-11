const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
dotenv.config();
const { feedData } = require("./helpers/feedData");
const csv = require('csv-parser')
const fs = require('fs')
const options = {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

const PORT= process.env.PORT;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', true);
mongoose
  .connect(MONGODB_URI, options)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth',require('./routes/auth'));
app.use(require('./routes/index'))
// feedData()



app.listen(PORT, () => {
    console.log("Server started at 8010")
})