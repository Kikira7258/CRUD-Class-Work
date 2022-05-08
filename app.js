// const res = require('express/lib/response');
// const req = require('express/lib/request');
// const Connection = require('mysql2/typings/mysql/lib/Connection');
// const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2')
require('dotenv').config({path:'./secrets.env'});
let ejs = require('ejs');
const path = require('path');
const { postcss } = require('tailwindcss');
const { response } = require('express');
const router = express.Router();

var app = express();


// enable the reading of static ejs files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// enable the use of static css files
app.use(express.static(path.join(__dirname,'/public')))

// config express server
app.use(express.json());
app.use('/', router);
app.use(express.urlencoded());


app.get('/', function(req, res) {
    res.redirect('/projects')
})

// app.get('/add', function(req, res) {
//     res.render('addnote')
// })

// app.get('/projects', function(req, res) {
//     res.render('projects')
// })


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



// Fetching fields from the database
app.get('/projects', (req, res) => {
    conn.query('SELECT * FROM projects ORDER BY id', (err, rows, fields) => {
        if (!err) {
            res.render('main',
            {
                project: [
                    {project_title: "title",
                    project_description: "description",
                    project_start_dt: "start_date",
                    project_due_dt: "due_date"}
                ],
                data: rows
            })
        }
        else
            console.log(err);
    })
})





// Send to add
app.get('/add-project', (req, res) => {
            res.render('addproject',
            {
                project_title: "",
                project_description: "",
                project_start_dt: "",
                project_due_dt: ""
            })
        })


        // note
app.get('/add-note', (req, res) => {
            res.render('addnote',
            {
                project_id: "",
                note: "",
                active_date: "",
            })
        })
 







// app.get('/projects/:id', (req, res) => {
//     conn.query('SELECT * FROM projects WHERE id='+ req.params.id, (err, rows, fields) => {
//         if (!err) {
//             res.render('projects',
//             {
//                 project: [
//                     {project_title: "title",
//                     project_description: "description",
//                     project_start_dt: "start_date",
//                     project_due_dt: "due_date"}
//                 ],
//                 data: rows
//             })
//         }
//         else
//             console.log(err);
//     })
// })




app.post('/add-project', (res, req) => {
    let data = {
        
        project_title: req.body.project_title,
        project_description: req.body.project_description,
        project_start_dt: req.body.project_start_dt,
        project_due_dt: req.body.project_due_dt
    };



    let sqlQuery = "INSERT INTO students SET ?"

    let vQuery = conn.query(sqlQuery, data, (err, results) => {
        if(err) throw err;
            res.setEncoding(JSONResponse(results));
            // res.redirect('/')
    });
});






function JSONResponse(results, err_code=200, err_msg='null') {
    return JSON.stringify({"status_code": err_code, "error":
    err_msg, "message": results});
}


function redirectTo(locationURL){
    response.writeHead(301, {
        location: locationURL
    }).end()
}



// app.post('/add-project', (res, req) => {
//     let sqlQuery = "UPDATE projects SET project_title ='" + req.body.project_title +
//                 "', project_description ='" + req.body.project_description +
//                 "', project_start_dt ='" + req.body.project_start_dt +
//                 "', project_due_dt =" + req.body.project_due_dt +
//                 "' WHERE id = " + req.body.id;
// })




// app.post('/add-project', (res, req) => {
//     let sqlQuery = "UPDATE projects SET project_id ='" + req.body.project_id +
//                 "', note ='" + req.body.note +
//                 "', active_date ='" + req.body.active_date +
//                 "' WHERE id = " + req.body.id;
// })
















// specify port to listen to
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));







