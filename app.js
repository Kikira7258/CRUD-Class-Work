const express = require('express');
const mysql = require('mysql2')
const bodyParser = require('body-parser');
require('dotenv').config({path:'./secrets.env'});
let ejs = require('ejs');
const path = require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { postcss } = require('tailwindcss');
const Connection = require('mysql2/typings/mysql/lib/Connection');
const router = express.Router();

const app = express();

// enable the reading of static ejs files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// enable the use of static css files
app.use(express.static(path.join(__dirname,'/public')))


app.get('/', function(req, res) {
    res.render('main')
})

app.get('/add', function(req, res) {
    res.render('addnote')
})

app.get('/projects', function(req, res) {
    res.render('projects')
})


var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "crudclasswork"
})



// tells if the database is connected or not
conn.connect(function(err){
    if(err) console.log(err);
    else console.log('Database connected!')
})



// app.get('/notes', (reg, res) => {
//     conn.query('SELECT * FROM crudclasswork.notes',() => (err, rows, fields) => {
//         if(!err)
//             res.render('notes', {notes_details:rows})
//         else
//             console.log(err);
//     })
// })




app.get('/projects', (req, res) => {
    conn.query('SELECT project_title, project_description AS description, project_start_dt AS start_date, project_due_dt AS due_date FROM crudclasswork.projects', (err, rows, fields) => {
        if (!err) {
            res.render('projects',
            {
                projects: [
                    {project_title: "title",
                    project_description: "description",
                    project_start_dt: "start_date",
                    project_due_dt: "due_date"}
                ]
            })
        }
        else
            console.log(err);
    })
})



// app.post('/save', (req, res) => {
//     let data = {project_title: req.body.title, project_description: req.body.description, project_start_dt: start_date, project_due_dt: due_date};
//     let sql = "INSERT INTO projects SET ?"
//     let query = Connection.query(sql, data,(err, result) => {
//         if(err) throw err;
//         res.redirect('/')
//     });
// });













// specify port to listen to
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));







