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
    user: 'koushincarfirm@gmail.com',
    pass: process.env.PRODUCTION_PASS
  }
})


// GET http://localhost:3000/api/v1/:id
app.get('/api/v1/deposit/:email/:userName/:address/:date/:products/:price', (req, res) => {
  const { email, userName, address, date, products, price } = req.params
  const mailOptions = {
    to: email,
    from: 'hakushin.express@gmail.com',
    subject: '入金の確認が終了いたしました。',
    html: `<body>
    <p>${userName}様</p>
    <p>更新綜合車両事務所です。</p>
    <p>${userName}様がご注文の入金確認が終了いたしました。ご注文内容は以下の通りです。</p>
    <table style='border-collapse: collapse' border='2'>
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
        <td>商品内容</td>
        <td>${products}</td>
      </tr>
      <tr>
        <td>ご注文金額</td>
        <td>¥${price}</td>
      </tr>
    </table>
    <p>商品の発送をもうしばらくお待ちくださいませ。<br><br><br>これからも更新綜合車両事務所をよろしくお願いいたします。</p>
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
app.get('/api/v1/deposit-warning/:email/:userName/:address/:date/:products/:price', (req, res) => {
  console.log('PassPassPass', process.env.PRODUCTION_PASS)
  const { email, userName, address, date, products, price } = req.params
  const mailOptions = {
    to: email,
    from: 'hakushin.express@gmail.com',
    subject: 'ご入金のご確認',
    html: `
    <body>
      <p>${userName}様</p>
      <p>更新綜合車両事務所です。</p>
      <p>${userName}様がご注文された商品入金が確認できていません。ご注文内容以下の通りです。</p>
      <table style='border-collapse: collapse' border='2'>
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
          <td>商品内容</td>
          <td>${products}</td>
        </tr>
        <tr>
          <td>商品代金</td>
          <td>${price}円</td>
        </tr>
      </table>
      <p>早急に${price}円を以下の口座にお振込いただくか，指定の住所に現金書留でお送りください。（長期間お振込いただけない場合はキャンセルさせていただく場合がございます）</p>
      <p>口座</p>
      <p>住所</p>
      <p><br><br>これからも更新綜合車両事務所をよろしくお願いいたします</p>
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

app.get('/api/v1/sent-shipment/:email/:userName/:address/:date/:products/:price/:shipmentNumber', (req, res) => {
  const { email, userName, address, date, products, price, shipmentNumber } = req.params
  const mailOptions = {
    to: email,
    from: 'hakushin.express@gmail.com',
    subject: '商品出荷のご連絡',
    html: `
    <body>
      <p>${userName}様</p>
      <p>更新綜合車両事務所です。</p>
      <p>${userName}様がご注文された商品を出荷いたしました。ご注文内容以下の通りです。</p>
      <table style='border-collapse: collapse' border='2'>
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
          <td>商品内容</td>
          <td>${products}</td>
        </tr>
        <tr>
          <td>商品代金</td>
          <td>${price}円</td>
        </tr>
        <tr>
          <td>追跡番号</td>
          <td>${shipmentNumber}</td>
        </tr>
        <tr>
          <td>追跡ページ</td>
          <td>
            <a href='https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=${shipmentNumber}&search=追跡スタート'>
              こちらをクリックしてください
            </a>
          </td>
        </tr>
      </table>
      <p>商品のご到着までもうしばらくお待ちくださいませ。</p>
      <p><br><br>これからも更新綜合車両事務所をよろしくお願いいたします</p>
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
