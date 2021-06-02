if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// Packages
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, chcekUser } = require('./middleware/authMiddleware');

// Routers
const userRoute = require('./routes/userRoute');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000, () => console.log('Server up and running!')))
  .catch((err) => console.log(err));

// routes
app.get('*', chcekUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/user', userRoute);

app.use( (req,res) => {
    res.render('404');
});