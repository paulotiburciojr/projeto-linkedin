const axios = require('axios');
axios.get('http://localhost:5000/api/documentos', {
  params: {
    tipo_post: ['in', 'posts']
  }
}).then(res => console.log("Total received:", res.data.total)).catch(console.error);
