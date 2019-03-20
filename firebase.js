const firebase = require('firebase/app')
require('firebase/database')

// const config = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID
// }

const config = {
  apiKey: "AIzaSyCpwQB1T64mawu3q0A_2vZBHZjfeIaSAU4",
  authDomain: "train-product-manager.firebaseapp.com",
  databaseURL: "https://train-product-manager.firebaseio.com",
  projectId: "train-product-manager",
  storageBucket: "train-product-manager.appspot.com",
  messagingSenderId: "1019313849328"
}

const f = firebase.initializeApp(config)

exports.read = (path) => {
  return f.database().ref(path).once('value')
}

exports.update = (path, data) => {
  return f.database().ref(path).update(data)
}
