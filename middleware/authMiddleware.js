if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.redirect('/user/login');
            }
            else{
                // console.log(decodedToken);
                next();
            }
        });
    }

    else{
        res.redirect('/user/login');
    }
}

const chcekUser = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err);
                res.locals.user = null;
                next();
            }

            else{
                // console.log(decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }

    else{
        res.locals.user = null;
        next(); 
    }
}

module.exports = {
    requireAuth,
    chcekUser
}