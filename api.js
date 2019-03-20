const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'hakushin.express@gmail.com',
    pass: 'imaimodels'
  }
})


// GET http://localhost:3000/api/v1/:id
app.get('/api/v1/deposit/:email', (req, res) => {
  const email = req.params.email
  const mailOptions = {
    to: email,
    from: 'hakushin.express@gmail.com',
    subject: 'アカウントの確認',
    html: '<p>テストメール</p>'
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err){
      console.log(err)
      res.json({
        message:`Failed sending mail to ${email}`
      })
    } else {
      console.log('Message sent: ' + info.accepted)
      res.json({
        message:`Succeed sending mail to ${email}`
      })
    }
  })
})

app.listen(port)
console.log('listen on port ' + port)