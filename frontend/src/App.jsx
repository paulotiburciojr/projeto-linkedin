import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [documentos, setDocumentos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [tiposSelecionados, setTiposSelecionados] = useState([]);
  const opcoesTipo = ["in", "posts", "new", "company", "jobs"];

  const carregarDados = async (numPagina, termoBusca = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/documentos`, {
        params: {
          page: numPagina,
          limit: 10,
          campo_busca: termoBusca,
          // Enviamos o array de tipos. O Axios transforma isso em tipo_post[]=in&tipo_post[]=posts
          //tipo_post: tiposSelecionados,
          tipo_post: tiposSelecionados,
        },
      });
      setDocumentos(response.data.data);
      setTotalPaginas(response.data.pages);
      setTotalDocs(response.data.total);
      setPagina(response.data.page);
      if (response.data.data.length > 0)
        setDocSelecionado(response.data.data[0]);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados(pagina, busca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const handleBusca = (e) => {
    e.preventDefault();
    setPagina(1);
    carregarDados(1, busca);
  };

  return (
    <div
      style={{
        position: "fixed", // Força o app a "colar" nas bordas da tela
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        backgroundColor: "#f4f4f4",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* 1. CABEÇALHO - AGORA COM ALTURA FIXA E COR DE DESTAQUE */}
      <header
        style={{
          height: "80px", // Altura fixa para garantir visibilidade
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "16px", color: "white" }}>
          Pesquisa Escala 6x1 | {totalDocs} registros
        </h2>
        <form
          onSubmit={handleBusca}
          style={{ marginTop: "5px", display: "flex", gap: "5px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "#f4f7f6",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #dfe6e9",
              flexWrap: "wrap", // Garante que em telas menores os itens se ajustem
            }}
          >
            {/* LADO ESQUERDO: Busca por Palavra-Chave */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flex: "1",
                minWidth: "300px",
              }}
            >
              <input
                type="text"
                placeholder="Pesquisar termo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={() => {
                  setPagina(1);
                  carregarDados(1, busca);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2c3e50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Buscar
              </button>
            </div>

            {/* LADO DIREITO: Checklist de Tipos (Múltipla Seleção) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingLeft: "20px",
                borderLeft: "2px solid #ddd", // Uma divisória sutil
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#636e72",
                }}
              >
                Tipos:
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                {opcoesTipo.map((tipo) => (
                  <label
                    key={tipo}
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: tiposSelecionados.includes(tipo)
                        ? "#e1f5fe"
                        : "transparent",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      transition: "0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tiposSelecionados.includes(tipo)}
                      onChange={() => {
                        const novosTipos = tiposSelecionados.includes(tipo)
                          ? tiposSelecionados.filter((t) => t !== tipo)
                          : [...tiposSelecionados, tipo];
                        setTiposSelecionados(novosTipos);
                      }}
                      style={{ marginRight: "5px" }}
                    />
                    {tipo}
                  </label>
                ))}
              </div>

              {/* Botão para aplicar apenas os filtros de tipo se desejar */}
              <button
                onClick={() => {
                  setPagina(1);
                  carregarDados(1, busca);
                }}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                Filtrar
              </button>
            </div>
          </div>
        </form>
      </header>

      {/* 2. ÁREA DE CONTEÚDO */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LISTA LATERAL */}
        <aside
          style={{
            width: "280px",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {loading ? (
            <p style={{ padding: "10px" }}>Carregando...</p>
          ) : (
            documentos.map((doc) => (
              <div
                key={doc._id}
                onClick={() => setDocSelecionado(doc)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  fontSize: "12px",
                  backgroundColor:
                    docSelecionado?._id === doc._id ? "#e1f5fe" : "transparent",
                }}
              >
                <strong>{doc.titulo || "Sem Título"}</strong>
                <div style={{ fontSize: "10px", color: "#999" }}>
                  ID: {doc._id}
                </div>
              </div>
            ))
          )}
        </aside>

        {/* VISUALIZAÇÃO DO POST */}
        <main
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          {docSelecionado ? (
            <div style={{ textAlign: "left", maxWidth: "950px" }}>
              {/* CABEÇALHO DO POST - Informações extraídas */}
              <section
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    margin: "0 0 10px 0",
                    color: "#2c3e50",
                  }}
                >
                  {docSelecionado.titulo || "Título não disponível"}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <strong>Autor:</strong>{" "}
                    {docSelecionado.autor || "Não identificado"}
                  </div>
                  <div>
                    <strong>Data:</strong>{" "}
                    {docSelecionado.data_postagem || "N/A"}
                  </div>
                  <div>
                    <strong>Link original:</strong>{" "}
                    <a
                      href={docSelecionado.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#3498db" }}
                    >
                      Ver no LinkedIn
                    </a>
                  </div>
                  <div>
                    <strong>ID do Banco:</strong>{" "}
                    <span style={{ color: "#999" }}>{docSelecionado._id}</span>
                  </div>
                  <div>
                    <strong>Tipo de postagem:</strong>{" "}
                    <span style={{ color: "#999" }}>
                      {docSelecionado.tipo_post}
                    </span>
                  </div>
                </div>
              </section>

              <section
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  textAlign: "left",
                }}
              >
                <strong
                  style={{
                    fontSize: "12px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Filtrar listagem por Tipo de Post:
                </strong>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {opcoesTipo.map((tipo) => (
                    <label
                      key={tipo}
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tiposSelecionados.includes(tipo)}
                        onChange={() => {
                          const novosTipos = tiposSelecionados.includes(tipo)
                            ? tiposSelecionados.filter((t) => t !== tipo) // Remove se já estava
                            : [...tiposSelecionados, tipo]; // Adiciona se não estava

                          setTiposSelecionados(novosTipos);
                          //setPagina(1); // Volta para a primeira página ao filtrar
                        }}
                        style={{ marginRight: "5px" }}
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    borderTop: "1px solid #eee",
                    paddingTop: "10px",
                  }}
                >
                  <button
                    onClick={() => {
                      setPagina(1);
                      carregarDados(1, busca); // Agora ele usa o estado atual de tiposSelecionados
                    }}
                    style={{
                      backgroundColor: "#2980b9", // Azul profissional
                      color: "white",
                      border: "none",
                      padding: "6px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Aplicar Filtros de Tipo
                  </button>

                  {tiposSelecionados.length > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#7f8c8d",
                        marginLeft: "10px",
                      }}
                    >
                      {tiposSelecionados.length} selecionado(s)
                    </span>
                  )}
                </div>
              </section>

              {/* TEXTO PROCESSADO - Se você tiver um campo de texto limpo */}
              {docSelecionado.texto_limpo && (
                <section style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "14px", color: "#555" }}>
                    Texto Extraído (Para análise):
                  </h4>
                  <div
                    style={{
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      backgroundColor: "#fff",
                      padding: "15px",
                      borderLeft: "4px solid #3498db",
                    }}
                  >
                    {docSelecionado.texto_limpo}
                  </div>
                </section>
              )}

              {/* PÁGINA BRUTA - O "print" original do post */}
              <section>
                <h4 style={{ fontSize: "14px", color: "#555" }}>
                  Visualização Original (HTML):
                </h4>
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "10px",
                    zoom: "0.8", // Diminui um pouco o tamanho do HTML original para caber melhor
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: docSelecionado.pagina_bruta,
                    }}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div
              style={{ textAlign: "center", marginTop: "100px", color: "#ccc" }}
            >
              Selecione um registro para iniciar a análise detalhada.
            </div>
          )}
        </main>
      </div>

      {/* 3. RODAPÉ */}
      <footer
        style={{
          height: "50px",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          style={{ fontSize: "12px", padding: "5px 10px" }}
        >
          Anterior
        </button>
        <span style={{ margin: "0 15px", fontSize: "12px" }}>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          style={{ fontSize: "12px", padding: "5px 10px" }}
        >
          Próxima
        </button>
      </footer>
    </div>
  );
}

export default App;
