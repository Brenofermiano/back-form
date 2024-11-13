import express from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors())

app.post("/usuarios", async (req, res) => {
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});


app.get("/usuarios", async (req, res) => {
  try {
    const { name } = req.query; // Extrai o nome da query string

    if (name) {
      // Busca o primeiro usuário com o nome exato
      const user = await prisma.user.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" }, // Nome exato, ignorando maiúsculas/minúsculas
        },
      });

      // Se não encontrar o usuário
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Caso encontre, retorna o usuário
      return res.status(200).json(user);
    } else {
      // Se não passar nome, retorna todos os usuários
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar os usuários." });
  }
});


app.put("/usuarios/:id", async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ message: "Usuário deletado com Sucesso!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
