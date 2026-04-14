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
require("dotenv").config();
//mongoose.connect(process.env.MONGO_URI);
const uri = process.env.MONGO_URI;
console.log("uri: ", uri);

mongoose
  .connect(uri)
  .then(() =>
    console.log("Conectado ao Atlas! Agora os dados estão na nuvem ☁️"),
  )
  .catch((err) => console.error("Erro ao conectar:", err));

//mongoose.connect("mongodb://localhost:27017/linkedin");

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
    comentarios: [String],
    num_reacoes: String,
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

app.get("/api/documentos", async (req, res) => {
  try {
    //console.log("QUERY RECEBIDA: ", req.query);
    // Pegamos a página e a limit da URL (ex: ?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Também precisamos aplicar os filtros no banco agora,
    // já que não temos tudo em memória.
    const query = {
      valido: { $ne: false },
      excedente: { $ne: true }
    };
    
    if (req.query.tipo_post) {
      // O Axios/Express às vezes envia como string se for só um, ou array se forem vários
      const tipos = Array.isArray(req.query.tipo_post)
        ? req.query.tipo_post
        : [req.query.tipo_post];
        
      if (tipos.length > 0) {
        query.tipo_post = { $in: tipos };
      }
    }

    if (req.query.campo_busca) {
      // Otimização: Escapar caracteres especiais na string de busca para evitar erros de Regex
      const termoEscapado = req.query.campo_busca.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.texto_limpo = new RegExp(termoEscapado, "i");
    }

    // Otimização: Executar a contagem (countDocuments) e a busca (find) em paralelo
    const [total, docs] = await Promise.all([
      Documento.countDocuments(query),
      Documento.find(query)
        .sort({ _id: 1 }) // Garante a ordem de inclusão no banco (mais antigos primeiro)
        .skip(skip)
        .limit(limit)
        .lean() // .lean() retorna JS puro ao invés do Documento Mongoose inteiro
    ]);

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
