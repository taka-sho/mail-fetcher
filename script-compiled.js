require('./api');

const inbox = require('inbox');

const parser = require('mailparser').simpleParser;

const iconv = require('iconv');

const moment = require('moment');

const conv = new iconv.Iconv("ISO-2022-JP", "UTF-8");

const {
  read,
  update
} = require('./firebase');

const client = inbox.createConnection(false, 'imap.gmail.com', {
  secureConnection: true,
  auth: {
    user: 'hakushin.express@gmail.com',
    pass: 'imaimodels'
  }
});
client.on('connect', () => {
  client.openMailbox('INBOX', (error, info) => {
    if (error) throw error;
    console.log('Successfully connected to server');
  });
});
client.on('new', message => {
  const stream = client.createMessageStream(message.UID);
  parser(stream).then(async mail => {
    const body = conv.convert(mail.text).toString();
    const data = await parse2db(body);
    console.log(data);
    update('orders/', data); // const body = mail.text
  }).catch(err => {
    console.log(err);
  });
});
client.connect();

async function parse2db(text) {
  const eachContent = text.replace(/\r?\n/g, '').split('['); // 改行削除，'['でコンテンツ別Array

  const r = eachContent.slice(1, eachContent.length - 1) // １つ目の要素（削除）
  .map(val => val.split(']')); // 各情報のkey-valueを分ける

  let products = {};
  let user_info = {};
  const s = r.map(val => {
    if (val[0].match(/】/)) {
      // '】'の有無で「注文商品情報」か「注文者情報」かを判別
      let p_info = val[0].split('】')[0].split('【').slice(-1)[0].split(' ');
      p_info = p_info.map(p => p.replace(/ /g, ''));
      val = val.map(p => p.replace(/ /g, ''));

      if (p_info[0].toLowerCase().match(/tomix|kato|gm/)) {
        // TOMIX|KATO|GM 製品
        products[`${p_info[0]}-${p_info[1]}`] = val[1];
      } else {
        // 自社製品
        if (val[1]) products[p_info[0]] = val[1];
      }

      return null;
    } else {
      val = val.map(p => p.replace(/ /g, '')); // 注文者情報

      switch (val[0]) {
        case 'お客様名':
          user_info['userName'] = val[1];
          break;

        case 'メールアドレス':
          user_info['mail'] = val[1];
          break;

        case '御社名(企業の方のみ)':
          user_info['companyName'] = val[1];
          break;

        case 'お電話番号':
          user_info['tell'] = val[1];
          break;

        case 'お届け先住所':
          user_info['address'] = val[1];
          break;

        case 'お支払い方法':
          user_info['payment'] = val[1];
          break;

        case '製品化してほしい車両パーツ(最大3つまで)':
          user_info['opinions'] = val[1];

        case 'その他':
          user_info['other'] = val[1];
          break;

        default:
          user_info[val[0]] = val[1];
          break;
      }

      return null;
    }
  });
  user_info.products = products;
  const new_id = await generateNewId();
  const initial_values = {
    id: new_id,
    productsStatus: '',
    depositStatus: '',
    shipmentStatus: '',
    key: new_id,
    orderDate: moment().format('YYYY/MM/DD/hh:mm')
  };
  Object.keys(initial_values).forEach(key => {
    user_info[key] = initial_values[key];
  });
  return {
    [new_id]: user_info
  };
}

async function generateNewId() {
  const products = await read('/orders');

  if (!products.val()) {
    return 'A000';
  } // Generate nextId


  const a = Object.keys(products.val()).sort().slice(-1)[0];
  const idAlph = a[0];
  const idNum = Number(a.substring(1, 4));
  let nextAlph = '';
  let nextNum = '';

  if (idNum === 999) {
    nextAlph = String.fromCharCode(idAlph.charCodeAt(0) + 1);
    nextNum = '000';
  } else {
    nextAlph = idAlph;
    nextNum = `00${idNum + 1}`.slice(-3);
  }

  return `${nextAlph}${nextNum}`;
}
