const User = require("../models/User");
const jwt = require('jsonwebtoken');

// Handle errors
const handleErrors = (err) => {
    let errors = {email: '', password: ''};

    // console.log(err.message, err.code);

    // duplicate error code
    if(err.code === 11000){
        errors.email = "Email already used";
        return errors;
    }   

    // validation error
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach( ({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    // Incorrect email
    if(err.message === 'Incorrect email'){
        errors.email = 'Email not registered';
    }

    if(err.message === 'Incorrect password'){
        errors.password = 'The password is incorrect';
    }

    return errors;
}

const maxAge = 3*60*60*24;

// Create json web token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: maxAge});
}


// Controllers
module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.signup_post = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.create({email, password}); // Creating the user
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge * 1000});

        res.status(201).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email,password);
        //Sending the jwt in cookies...
        res.cookie('jwt',createToken(user._id), {httpOnly:true, expiresIn: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({errors});
    }

}

module.exports.logout_get = async (req,res) => {
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/');
}