 const express = require('express');
 const TodoRouter = new express.Router()
 const Todo = require('../models/todo')
     // bcrypt hash password 
 const bcrypt = require('bcrypt');

 // jsonwebToken
 const jwt = require('jsonwebtoken');

 // base path /api/todos


 //  create post

 TodoRouter.post('/', async(req, res) => {
     try {
         const { authorization } = req.headers;
         const signedData = jwt.verify(authorization, 'signingSecret');
         const { body, title, tags } = req.body;
         const todo = Todo.create({ userId: signedData.id, body, title, tags });
         console.log(todo);
         if (!todo) throw new error("failed created successsfully")
         res.statuscode = 201;
         res.send({ message: "todo created successsfully" })
     } catch (error) {
         console.error(error);
         res.statusCode = 401;
         res.json({ message: "Authentication failed" });

     }

 })

 // Return the todos of specific user 
 TodoRouter.get('/', (req, res) => {

     try {
         const { authorization } = req.headers;
         const signedData = jwt.verify(authorization, 'signingSecret');
         Todo.find({ userId: signedData.id }, function(err, todos) {
             if (err) res.send(err.message);
             else { res.send(todos) }
         });

     } catch (error) {
         res.statusCode = 401;
         res.json({ message: "Authentication failed" });
     }
 })

 // Edit todo
 TodoRouter.patch('/:id', async(req, res) => {
     try {
         const { authorization } = req.headers;
         const signedData = jwt.verify(authorization, 'signingSecret');
         const { title, body } = req.body
         let updatedTodo
         if (title) {
             try {

                 doc = await Todo.findOneAndUpdate({ userId: signedData.id, _id: req.params.id }, { title: title }, { new: true })
                 updatedTodo = doc;
             } catch (err) {
                 res.send(err);
             }
         }
         if (body) {
             try {

                 doc = await Todo.findOneAndUpdate({ userId: signedData.id, _id: req.params.id }, { body: body }, { new: true })
                 updatedTodo = doc;
             } catch (err) {
                 res.send(err);
             }
         }
         res.send(updatedTodo);

     } catch (error) {
         res.statusCode = 401;
         res.json({ message: "Authentication failed" });
     }
 })

 //  delete Todo
 TodoRouter.delete('/:id', (req, res, next) => {
     const { authorization } = req.headers;
     const signedData = jwt.verify(authorization, 'signingSecret');
     Todo.deleteOne({ userId: signedData.id, _id: req.params.id }, function(err, Delpost) {
         if (err) res.send(err.message);
         else { res.send({ message: 'deleted successfully', Delpost }) }
         return;
     });
 })



 module.exports = TodoRouter;