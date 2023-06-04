require('dotenv').config();
const mongoose = require('mongoose');
const DB = process.env.DB;
// console.log(DB);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>{console.log(`Database Connected.`)})
.catch((err)=>{console.log(err)});
