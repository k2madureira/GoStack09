const express = require('express');

const server = express();

server.use(express.json());

/****************** 
  Global variables
*******************/

var cont = 0;
const projects =[
  {
    id: "1",
    title: "projeto 01",
    tasks: []
  }
];


/************ 
  Middleware
**************/


function contReq( req, res, next) {
  console.time('Time');
  cont++;
  next();
  console.log(cont);
  console.timeEnd('Time');
}

function searchId(req, res, next) {
  const { id } = req.params;

  const search = projects.find(x=>x.id == id);

  if(!search) {
    return res.status(400).json({ error: "User not found !"});
  }
  return next();

}


/************ 
    Routes
**************/

server.get('/projects', contReq,(req, res)=>{
  return res.json(projects);
});

server.post('/projects', contReq,(req, res)=>{
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  const project = {
    id,
    title,
    tasks,
  };

  projects.push(project);

  return res.json(projects);

});

server.post('/projects/:id/tasks', contReq, searchId,(req, res)=>{
  const { id } = req.params;
  const { tasks } = req.params;
  const titleTask = req.body.title;

  projects.find(w=>w.id == id).tasks.push(titleTask);

  return res.json(projects);


});

server.put('/projects/:id', contReq, searchId,(req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  projects.find(x=>x.id == id).title = title;

  return res.json(projects);

});

server.delete('/projects/:id', contReq,(req, res)=>{
  const { id } = req.params;

  const index = projects.findIndex(y=>y.id == id);
  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3000);