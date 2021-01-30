const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.warn('failed to connect db ')
        console.log(err);
        process.exit();

    }
    console.info(`connect to db successfully`)

});