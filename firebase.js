console.log('provate key id', process.env.FIREBASE_PRIVATE_KEY_ID)
console.log('private key', process.env.FIREBASE_PRIVATE_KEY)
console.log('client email', process.env.FIREBASE_CLIENT_EMAIL)
console.log('client id', process.env.FIREBASE_CLIENT_ID)
console.log('client_x509_cert_url', process.env.FIREBASE_CLIENT_X509_CERT_URL)

const admin = require("firebase-admin")
const serviceAccount = {
  "type": "service_account",
  "project_id": "train-product-manager",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://train-product-manager.firebaseio.com"
})

exports.read = (path) => {
  return admin.database().ref(path).once('value')
}

exports.update = (path, data) => {
  return admin.database().ref(path).update(data)
}

exports.login = (email, pass) => {
  return admin.auth().signInWithEmailAndPassword(email, pass)
}
