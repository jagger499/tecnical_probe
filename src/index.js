
const express       = require("express");
const app           = express();
const path          = require("path");
const { moongose }  = require("./database");

const morgan        = require("morgan");

//Settings
    app.set('port', process.env.PORT || 3000);

//Midleware
    app.use(morgan('dev'));
    app.use(express.json());

//Routes
    app.use('/api/tasks',require("./routes/routes"));

//Static files
    app.use(express.static(path.join(__dirname,'public')));


//Starting the server

app.listen(app.get('port'), () => {
    console.log( `Server on port ${app.get('port')}`);
})