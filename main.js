const fs = require("fs");
const { cert } = require("firebase-admin/app");
const admin = require("firebase-admin");
const converter = require("json-2-csv");

const serviceAccount = require("PATH-TO-SERVICE-ACCOUNT-KEY.json");

admin.initializeApp({
  credential: cert(serviceAccount),
});

const db = admin.firestore();

async function listAllDocuments(collectionPath) {
  try {
    const documents = [];
    const collectionRef = db.collection(collectionPath);
    const documentsInCollection = await collectionRef.listDocuments();
    for (const doc of documentsInCollection) {
      documents.push(doc.id);
    }
    return documents;
  } catch (error) {
    console.error("Error getting documents:", error);

    throw error;
  }
}

async function getAllDocuments(collectionPath) {
  try {
    const documents = [];
    const subDocs = await listAllDocuments(collectionPath);
    for (const subDoc of subDocs) {
      console.log("Fetching documents from subcollection:", subDoc);
      const collectionRef = db.collection(collectionPath).doc(subDoc);
      const doc = await collectionRef.get();
      const collectionsInDoc = await doc.ref.listCollections();
      for (const col of collectionsInDoc) {
        const docs = await col.get();
        docs.forEach((doc) => {
          const firebaseDocument = doc.data();
          Object.assign(firebaseDocument, { FS_ID: doc.id });
          documents.push(firebaseDocument);
        });
      }
    }
    const csv = converter.json2csv(documents, {});
    fs.writeFileSync(["out", collectionPath, "csv"].join("."), csv);
    console.log(
      "CSV file named '{}' has been saved".replace("{}", collectionPath),
    );
  } catch (error) {
    console.error("Error getting documents and subcollections:", error);

    throw error;
  }
}

const collectionPath = process.argv[2];
if (!collectionPath) {
  throw new Error("Please provide a collection path");
}

getAllDocuments(collectionPath);
