const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// MIDDLEWARE DE VALIDAÇÃO

function validateRepository(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (!isUuid(id) || repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository or Id Not Found" });
  }

  return next();
}

app.use("/repositories/:id", validateRepository);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const result = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const { title, url, techs } = request.body;
  const repository = { title, url, techs };

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    ...repository,
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
