const express = require('express');

const server = express();
server.use(express.json());

server.use((req, res, next)=>{
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url} `);
  next();
  console.timeEnd('Request');
});


function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ msg: 'Name fild no exist!'});
  }

  return next();
}

function checkUserInArray(req, res, next) {

  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({ msg: 'User no exist!'});
  }

  req.user = user;

  return next();
}


const users = ['João', 'Maria', 'José'];

server.get('/users',  (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res)=>{
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res)=>{
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, (req, res)=>{
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res)=>{
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});


server.listen(3000);