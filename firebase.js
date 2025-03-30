const admin = require('firebase-admin');
const fs = require('fs');

// Reemplaza con la ruta a tu archivo de credenciales de cuenta de servicio
const serviceAccount = require('./Admin/JSON/key_serive_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'escaparate-7446a' // Reemplaza con tu Project ID
});

const db = admin.firestore();

// Reemplaza con la ruta a tu archivo JSON
const jsonData = require('./Admin/JSON/json-general.json');

async function importData() {
  try {
    for (const collectionName in jsonData) {
      if (jsonData.hasOwnProperty(collectionName)) {
        const collectionData = jsonData[collectionName];

        for (const documentId in collectionData) {
          if (collectionData.hasOwnProperty(documentId)) {
            const documentData = collectionData[documentId];

            await db.collection(collectionName).doc(documentId).set(documentData);
            console.log(`Document ${documentId} creado en la colección ${collectionName}`);
          }
        }
      }
    }

    console.log('¡Datos importados exitosamente!');
  } catch (error) {
    console.error('Error al importar datos:', error);
  }
}

importData();
