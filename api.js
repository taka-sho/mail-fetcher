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
    pass: process.env.PASS
  }
})


// GET http://localhost:3000/api/v1/:id
app.get('/api/v1/deposit/:email/:userName/:address/:date/:products', (req, res) => {
  const { email, userName, address, date, products } = req.params
  const mailOptions = {
    to: email,
    from: 'hakushin.express@gmail.com',
    subject: '入金の確認が終了いたしました。',
    html: `<body>
    <p>${userName}様</p>
    <p>更新綜合車両事務所です。</p>
    <p>${userName}様がご注文された商品入金確認が終了いたしました。商品内容は以下の通りです。</p>
    <table style='border-width: thin; border-style: solid'>
      <tr>
        <td>お客様名</td>
        <td>${userName}</td>
      </tr>
      <tr>
        <td>ご注文日時</td>
        <td>${date}</td>
      </tr>
      <tr>
        <td>ご住所</td>
        <td>${address}</td>
      </tr>
      <tr>
        <td>ご注文内容</td>
        <td>${products}</td>
      </tr>
    </table>
    </body>
    `
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
