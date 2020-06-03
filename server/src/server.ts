import express from "express";
import faker from "faker";

const app = express();
app.use(express.json());

const users = [...Array(5)].map((it) => faker.name.findName());

app.get("/users", (request, response) => {
  const search = String(request.query.search).toLowerCase();

  const filteredUser = users.filter((user) =>
    user.toLowerCase().includes(search)
  );

  response.json({ users: filteredUser });
});

app.get("/users/:id", (request, response) => {
  const id = Number(request.params.id);

  const user = users[id];
  response.json({ user });
});

app.post("/users", (request, response) => {
  const data = request.body;

  console.log(data);
  const user = {
    name: data.name,
    email: data.email,
  };

  return response.json(user);
});

app.listen(3333);
