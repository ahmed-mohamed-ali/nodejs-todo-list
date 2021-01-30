const express = require('express')
const app = express()
app.use(express.static('public'));
app.use(express.json());

require('./db-connection');
const port = 3000

const TodoRouter = require('./Routers/todos');
const UserRouter = require('./Routers/users');
// logging middleware 
app.use('/*', (req, res, next) => {
    console.log(`request method: ${req.method}`);
    console.log(`rquest params: ${req.params['0']}`);
    let now = Date.now();
    console.log(`current time : ${now}`);
    next();
});
app.use('/api/todos', TodoRouter);
app.use('/api/users', UserRouter);

// global error handeler
app.use(function(err, req, res, next) {

    console.error(err.stack)
    res.status(500).send({ "error": "internal server error" })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})