const moongose = require("mongoose");
const URI = 'mongodb://localhost/mern-task';

moongose.connect(URI)
        .then(db => console.log("db is conected"))
        .catch(e => console.log(e));

module.exports = moongose;