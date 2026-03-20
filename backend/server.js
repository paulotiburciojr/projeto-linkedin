const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão MongoDB
//mongoose.connect("mongodb://localhost:27017/linkedin", {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
mongoose.connect("mongodb://localhost:27017/linkedin");

const DocSchema = new mongoose.Schema(
  {
    campo_busca: String,
    titulo: String,
    pagina: Number,
    posicao: Number,
    link: String,
    link_mostrado: String,
    palavras_chave: [String],
    snippet: String,
    fonte: String,
    data_postagem: String,
    periodo: String,
    data_execucao: String,
    status_pagina: String,
    pagina_bruta: String,
    tipo_post: String,
    assunto: { type: String, default: "" },
    valido: { type: Boolean, default: true },
    texto_limpo: String,
  },
  { collection: "dados_pesquisa_google" },
);

const Documento = mongoose.model("Documento", DocSchema);

// Rota principal que responde o Hello World
app.get("/", (req, res) => {
  res.send("Hello World! O servidor Node está vivo! 🚀");
});

// Rota de teste para ver se o JSON está funcionando
app.get("/api/teste", (req, res) => {
  res.json({ mensagem: "Hello World em formato JSON" });
});

// Rota para buscar todos os documentos
app.get("/api/documentos", async (req, res) => {
  try {
    // Pegamos a página e o limite da URL (ex: ?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Também precisamos aplicar os filtros no banco agora,
    // já que não temos tudo em memória.
    const query = {};
    if (req.query.campo_busca)
      query.campo_busca = new RegExp(req.query.campo_busca, "i");
    if (req.query.tipo_post) query.tipo_post = req.query.tipo_post;
    if (req.query.valido) query.valido = req.query.valido === "true";

    const total = await Documento.countDocuments(query);
    const docs = await Documento.find(query).skip(skip).limit(limit).lean(); // .lean() para ser mais leve

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: docs,
    });
  } catch (err) {
    res.status(500).send("Erro ao buscar dados");
  }
});

// Rota para atualizar campos (Update on Blur)
app.patch("/api/documentos/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  await Documento.findByIdAndUpdate(id, updates);
  res.sendStatus(200);
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
