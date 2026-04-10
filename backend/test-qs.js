const qs = require('qs');
console.log(qs.parse('tipo_post[]=in&tipo_post[]=jobs'));
console.log(qs.parse('tipo_post=in&tipo_post=jobs'));
