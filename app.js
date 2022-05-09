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
const flash = require('express-flash');

var app = express();


// enable the reading of static ejs files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// enable the use of static css files
app.use(express.static(path.join(__dirname,'/public')))

// config express server
app.use(express.json());
app.use('/', router);
app.use(express.urlencoded({extended: true}));


app.get('/', function(req, res) {
    res.redirect('/projects')
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





// ADD ROUTE
// When adding the fields, it should be clear
app.get('/add-project', (req, res) => {
            res.render('addproject',
            {
                project_id: "",
                project_title: "",
                project_description: "",
                project_start_dt: "",
                project_due_dt: ""
            })
        })


        // linking the note route dynamically to the project
app.get('/add-note/:id', (req, res) => {
            res.render('addnote',
            {
                project_id: req.params.id,
                note: "",
                active_date: "",
                note_id: ""
            })
        })
 

        // getting data from the form
app.post('/add-note/:id', (req, res) => {
    let nt_data = {
        project_id: req.params.id,
        note: req.body.note,
        active_date: req.body.active_date
    }

        // query insertd into the database, then after its directed back to the project
    conn.query('INSERT INTO notes SET ?', nt_data, (err, results) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/project_details/' +  req.params.id)
        }
    })

})





// corresponse with the name in the html, its also the same when creating, should be the same for codes sharing the same route

app.post('/add-project', (req, res) => {
    let data = {
        
        project_title: req.body.title,
        project_description: req.body.description,
        project_start_dt: req.body.start_date,
        project_due_dt: req.body.due_date
    };



    let sqlQuery = "INSERT INTO projects SET ?"

    let vQuery = conn.query(sqlQuery, data, (err, results) => {
        if(err) throw err;
            // res.setEncoding(JSONResponse(results));
            res.redirect('/projects')
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





// When editing, the fields will be the data from the database
app.get('/projects/edit/:id', (req, res) => {
    conn.query('SELECT * FROM projects WHERE id = ' + req.params.id, (err, row) => {
        if(err){
            console.log(err)
        } else {
            console.log(row[0])

            // dynamically change the fields of the edited project to sync with its project
            // new Date(<date>).toISOString().split('T')[0]

            res.render('addproject', {
                project_id: row[0].id,
                project_title: row[0].project_title,
                project_description: row[0].project_description,
                project_start_dt: new Date(row[0].project_start_dt).toISOString().split('T')[0],
                project_due_dt: new Date(row[0].project_due_dt).toISOString().split('T')[0]  
                
            });
        }
    })
})







// corresponse with the name in the html, its also the same when creating, should be the same for codes sharing the same route
app.post('/projects/update/:id', (req, res) => {
    let sqlQuery = "UPDATE projects SET project_title ='" + req.body.title +
                "', project_description ='" + req.body.description +
                "', project_start_dt ='" + req.body.start_date +
                "', project_due_dt ='" + req.body.due_date +
                "' WHERE id = " + req.params.id;


                // set the route to redirect to after post
                conn.query(sqlQuery, (err, row) => {
                    if(err) {
                        console.log(err)
                    } else {
                        res.redirect('/projects')                        
                    }
                })
                
})





// Delete project page
app.get('/projects/delete/:id', function(req, res, next) {
    conn.query('DELETE FROM projects WHERE id = '+ req.params.id, function(err, row) {
        if(!err) {
            res.redirect('/projects')
        } else {
            console.log(err);
        }
    })
})






// Array starts at zero [0]
// Projects Details
app.get('/project_details/:id', function(req, res, next) {
    conn.query('SELECT * FROM projects WHERE id = '+ req.params.id, function(err, row) {
        if(!err) {
            conn.query('SELECT * FROM notes WHERE project_id = ' + req.params.id, (err, notes) => {
                if(!err) {
                    res.render('project-details', {
                        project_id: row[0].id,
                        project_title: row[0].project_title,
                        project_description: row[0].project_description,
                        project_start_dt: new Date(row[0].project_start_dt).toISOString().split('T')[0],
                        project_due_dt: new Date(row[0].project_due_dt).toISOString().split('T')[0],
                        
                        data: notes,
                        
                    });
                }
            })
            
        } else {
            console.log(err);
        }
    })
})





// Delete note

app.get('/note/delete/:id/:project_id', function(req, res, next) {
    conn.query('DELETE FROM notes WHERE id = '+ req.params.id, function(err, row) {
        if(!err) {
            res.redirect('/project_details/' + req.params.project_id)
        } else {
            console.log(err);
        }
    })
})














// specify port to listen to
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));







