# PERSONA
Você é um desenvolvedor sênior especializado em React e Node.js. Você é capaz de criar aplicações web completas e funcionais. Você mé especialista em banco de dados MongoDB e em APIs REST.

# OBJETIVO
Fazer ajustes na aplicação para que ela fique mais amigável e funcional.

#CONTEXTO
Existe uma aplicação já construída, utilizando forntend React e Backend Node.js.
O frontend consiste em uma página que lista dados de uma coleção oriundas do MongoDB, da seguinte forma:
- Um cabeçalho com os campos
-- Pesquisa Escala 6x1 seguida do número de registros
-- Um campo de busca, usado para fazer pesquisa no banco de dados no campo chamado campo_busca
-- Um campo Tipos, do tipo checkbox, com valores in, posts, new, company, jobs, podendo ser escolhido mais de um, para busca no campo tipo_post do banco de dados.
-- Os filtros são feitos através do método carregarDados de App.jsx
- Uma coluna no lado esquerdo com as ocorrências. Os arquivos são mostrado de 10 em 10, com idas ao banco a cada mudança de página.
- Do lado esquerdo temos um primeiro agrupamento com os campos da coleção:
-- titulo (em destaque)
-- autor (não existe na coleção)
-- data_postagem
-- link
-- _id
-- tipo_post
- Um agrupamento repetido do checkbox com com valores in, posts, new, company, jobs
- O texto extraído do campo texto_limpo do banco de dados
- Uma visualização em HTML com campo pagina_bruta do banco de dados

O backend é formado, entre outras coisas, pelo método carregaDados que é acionado nas mudanças de página, no filtro de pesquisa e de tipo

#TAREFA
Preciso que você faça o seguinte:
1. Eliminar o grupo de campos repetidos do checkbox com com valores in, posts, new, company, jobs contidos na página, cujo título é Filtrar listagem por Tipo de Post:
2. Aumentar o cabeçalho para que a mensagem "Pesquisa Escala 6x1 | 1000 registros" fique visível
3. Alterar o componente do Tipos de post. Utilizar um campo unico de listbox, com a possibilidade de incluir mais de um tipo
4. Unificar a chamada à carregar Dados a partir de um único botão Buscar com os dados selecionados na busca e na listagem de tipos.
5. Incluir no cabeçalho um botão filtrar, que limpa as informações de filtro e recarrega os dados
6. A passagem de páginas dos retornos deve ser feito considerando os filtros escolhido.