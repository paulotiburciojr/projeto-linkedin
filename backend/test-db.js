require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const collection = mongoose.connection.db.collection('dados_pesquisa_google');
  
  const totalRaw = await collection.countDocuments({});
  console.log('Total raw:', totalRaw);

  const totalValido = await collection.countDocuments({ valido: true });
  console.log('Total valido (boolean):', totalValido);

  const totalValidoString = await collection.countDocuments({ valido: "true" });
  console.log('Total valido (string):', totalValidoString);
  
  const totalValidoMissing = await collection.countDocuments({ valido: { $exists: false } });
  console.log('Total onde valido não existe:', totalValidoMissing);

  const totalExcedenteBoolean = await collection.countDocuments({ excedente: false });
  console.log('Total excedente (false boolean):', totalExcedenteBoolean);

  const totalExcedenteString = await collection.countDocuments({ excedente: "false" });
  console.log('Total excedente (false string):', totalExcedenteString);

  const totalExcedenteMissing = await collection.countDocuments({ excedente: { $exists: false } });
  console.log('Total onde excedente não existe:', totalExcedenteMissing);

  mongoose.disconnect();
}).catch(console.error);
