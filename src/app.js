const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query
    
    const results = title
        ? repositories.filter(p => p.title.includes(title))
        : repositories

    return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoriesIndex = repositories.findIndex(p => p.id === id)

  if (repositoriesIndex < 0){
    return response.status(400).json({error: "Repositorie not found."})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes
  }

  repositories[repositoriesIndex] = repositorie

  return response.json(repositorie)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoriesIndex = repositories.findIndex(p => p.id === id)
  
  if (repositoriesIndex < 0){
      return response.status(400).json({error: "Repositorie not found."})
  }

  repositories.splice(repositoriesIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoriesIndex = repositories.findIndex(p => p.id === id)

  if (repositoriesIndex < 0){
      return response.status(400).json({error: "Project not found."})
  }

  const repositorie = repositories[repositoriesIndex]
  repositorie.likes++
  repositories[repositoriesIndex] = repositorie


  return response.json(repositorie)
});

module.exports = app;
