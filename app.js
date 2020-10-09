const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));

// view engine setup
app.set('views', './views');
app.set('view engine', 'html');

// setup the server
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(app);

//pg-promise set up
const config = {
  host: 'localhost',
  port: 5432,
  database: 'cruddb',
  user: 'postgres'
};

const pgp = require('pg-promise')();
const db = pgp(config);

// Reads all of the tasks
app.get('/tasks', (req, res)=>{
  db.many(`
    SELECT * FROM tasks;
  `)
  .then((tasks)=>{
    res.status(200).json(tasks);
  })
  .catch((e)=>{
    res.status(400).json();
  })
})

// Creates a new task
app.post('/tasks', (req, res)=>{
  const {task} = req.body;
  db.none(`
    INSERT INTO tasks (title) VALUES ($1);
  `, task)
  .then(()=>{
    res.status(201).json(); //successfully create
  })
  .catch(()=>{
    res.status(422).json(); //not successful create
  })
 
})

// updates if the task is completed
app.patch('/tasks/:id/is_completed', (req, res)=>{
  const {id} = req.params;
  db.none(`
    UPDATE tasks SET is_completed = true WHERE id = $1;
  `, id)
  .then(()=>{
    res.status(204).json();
  })
  .catch((e)=>{
    res.status(422).json(e);
  })
})

// updates the tasks title
app.patch('/tasks/:id/title', (req, res)=>{
  const {id} = req.params;
  const {task} = req.body;
  const info = {id: id, title: task};
  db.none("UPDATE tasks SET title = ${title} WHERE id = ${id};", info)
  .then(()=>{
    res.status(204).json();
  })
  .catch((e)=>{
    res.status(422).json(e);
  })
})

// Deletes a task
app.delete('/tasks/:id', (req, res)=>{
  const {id} = req.params;
  db.none(`
    DELETE FROM tasks WHERE id = $1;
  `, id)
  .then(()=>{
    res.status(202).json();
  })
  .catch(()=>{
    res.status(401).json();
  })
})


server.listen(port, hostname, ()=>{
  console.log(`Server is running at http://${hostname}:${port}/`);
})