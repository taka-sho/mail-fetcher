const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const adminMailAddress = 'koushincarfirm@gmail.com'

const port = process.env.PORT || 3000


var auth = {
  type: 'OAuth2',
  user: 'koushincarfirm@gmail.com',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: auth
})


// GET http://localhost:3000/api/v1/:id
app.get('/api/v1/deposit/:email/:userName/:address/:date/:products/:price', (req, res) => {
  const { email, userName, address, date, products, price } = req.params
  const mailOptions = {
    to: email,
    from: adminMailAddress,
    subject: '入金の確認が終了いたしました。',
    html: `<body>
    <p>${userName}様</p>
    <p>更新綜合車両事務所です。</p>
    <p>この度は更新綜合車両事務所頒布ページへご注文をいただきありがとうございます。本日、以下のご注文・商品の入金を確認させていただきましたのでご連絡させていただきます。</p>
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
    <p>商品が準備でき次第発送させていただきます。予約頒布品に関する開発状況などに関しては適宜Twitterなどで公開して参りますので引き続きよろしくお願い致します。</p>
    <p>更新綜合車両事務所頒布担当</p>
    </body>
    `
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
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
    from: adminMailAddress,
    subject: 'ご入金のご確認',
    html: `
    <body>
      <p>${userName}様</p>
      <p>この度は更新綜合車両事務所頒布ページへご注文をいただきありがとうございます。</p>
      <p>商品代金のお振込・ご送金を確認できておりませんもので、大変不躾ながらご連絡させていただく次第です。<br>
      一旦期限を延長させていただきますので、お振込・ご送金をいただけますようお願いいたします。また、もし何かご事情などがあるようでしたら、ご相談に乗らせていただきますので、ご連絡を頂けますと幸いです。<br>
      なおご入金済みの場合でも、このメールと入れ違いに銀行の営業日や郵便の到着日数等の関係で確認がとれていない場合もございます。その場合は悪しからず御容赦のほどお願い申し上げます。</p>
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
    from: adminMailAddress,
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
