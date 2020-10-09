# TODO CRUD

## About this repo
Goals:
1. Combine previous knowledge of REST APIs with new knowledge of SQL, Databases, and pg-promise package.
2. Practice creating API's that CREATE, READ, UPDATE, DELETE a database using the pg-promise package.

## What I Learned
1. the basics of pg-promise.
2. re-enforced my knowledge of creating a REST api.

## Code Snippets
The following is a snippet for the main get route of this API. It has a simply SQL query, that returns all columns from the table tasks. The response of the query is then sent to user as JSON data type.
```js
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
```