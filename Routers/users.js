const express = require('express');
const UserRouter = new express.Router()
const User = require('../models/user')
const Todo = require('../models/todo')

// bcrypt
const bcrypt = require('bcrypt');
// jsonwebToken
const jwt = require('jsonwebtoken');
// base path /api/users

UserRouter.post('/register/', async(req, res) => {

    try {
        const { username, password, firstName } = req.body

        // get hash password
        const hashPassword = await bcrypt.hash(password, 7);
        const user = User.create({ username, password: hashPassword, firstName });
        console.log(user);
        if (!user) throw new error("failed created successsfully")
        res.statuscode = 201;
        res.send({ message: "user created successsfully" })
    } catch (error) {
        // console.log(error)
        res.statuscode = 404;
        res.send({ message: "failed created successsfully", error })

    }
})

// login

UserRouter.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        // let userId, UserTodos

        // get username
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong username or password");

        // compare hashing password 
        console.log(password)
        console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("wrong username or password");

        // generate token and return it
        const token = jwt.sign({ id: user.id }, 'signingSecret');
        // res.json({ token });

        const userId = await User.find({ username: username }, '_id').exec();
        const UserTodos = await Todo.find({ userId: userId[0]._id }).exec()
        if (!UserTodos) throw new error("can not get UserTodos");
        // console.log(userId[0]._id)
        res.send({ message: "log in successfully", token, username, latesTodos: UserTodos })
    } catch (error) {
        res.statusCode = 401;
        res.send({ message: "invalid credential", error: error.message })
    }
})

// get  user FirstName
UserRouter.get('/', async(req, res) => {
        try {
            const { authorization } = req.headers;
            const signedData = jwt.verify(authorization, 'signingSecret');
            const user = await User.findOne({ _id: signedData.id }, 'firstName -_id');
            res.send(user);
        } catch (error) {
            console.error(error);
            res.statusCode = 401;
            res.json({ message: "Authentication failed" });

        }

    })
    // delete user
UserRouter.delete('/:id', async(req, res) => {
    const { authorization } = req.headers;
    const signedData = jwt.verify(authorization, 'signingSecret');
    User.findByIdAndDelete({ _id: signedData.id }, function(err, DelUser) {
        if (err) res.send(err.message);
        else { res.send({ message: 'deleted successfully', DelUser }) }
    });

})

// edit user
UserRouter.patch('/', async(req, res) => {
    const { authorization } = req.headers;
    const signedData = jwt.verify(authorization, 'signingSecret');
    const { username, password, firstName } = req.body;
    console.log(req.body)

    // check user name
    if (username) {
        try {
            let doc = await User.findOneAndUpdate({ _id: signedData.id }, { username: username }, {
                new: true
            });
        } catch (error) {
            res.send(error);
        }

    }
    if (password) {
        try {
            let doc = await User.findOneAndUpdate({ _id: signedData.id }, { password: password }, {
                new: true
            });
        } catch (error) {
            res.send(error);
        }

    }
    if (firstName) {
        try {
            let doc = await User.findOneAndUpdate({ _id: signedData.id }, { firstName: firstName }, {
                new: true
            });
            console.log(doc);
        } catch (error) {
            res.send(error);
        }
    }
    const updatedUser = await User.findOne({ _id: signedData.id }, { password: 0 });
    console.log(updatedUser);
    res.send({ message: "user was edited successfully", user: updatedUser });
})
module.exports = UserRouter;