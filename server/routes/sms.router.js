const express = require('express');
const axios = require('axios');
const pool = require('../modules/pool');
const router = express.Router();
const CronJob = require('cron').CronJob;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


router.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  let messageReceived = req.body.Body;
  console.log(messageReceived);



  let userId;
  let getUserQuery = `SELECT * FROM users WHERE phone_number=$1;`;
  pool.query(getUserQuery, [req.body.From])
    .then(result => {
      userId = result.rows[0].id


      let matchDate;
      let matchLocation;
      let matchAmount

      try {
        let dateRegex = /([0-9]{4}\/[0-9]{2}\/[0-9]{2})/;
        if (dateRegex.test(messageReceived)) {
          matchDate = dateRegex.exec(messageReceived)[0];
        }

        let properNounRegex = /(\s[A-Z]+[A-Za-z']*)+/;
        if (properNounRegex.test(messageReceived)) {
          matchLocation = properNounRegex.exec(messageReceived)[0].trim();
        }

        let amountRegex = /[$][0-9]*/;
        if (amountRegex.test(messageReceived)) {
          matchAmount = amountRegex.exec(messageReceived)[0].split('$')[1];
        }
        
        // regex failed

        if (/[Gg]ift[ ]*card/.test(messageReceived) && /[Aa]dd/.test(messageReceived)) {
          let addGiftcardQuery = `INSERT INTO cards(user_id,location,credit,expiration,type) VALUES($1,$2,$3,$4,$5);`;
          pool.query(addGiftcardQuery, [userId, matchLocation, matchAmount, matchDate, 'gift card'])
            .then(() => {
              client.messages
                .create({
                  body: `Your ${matchAmount} giftcard to ${matchLocation} has been added to your dashboard!`,
                  from: '+12015849969',
                  to: req.body.From
                })
                .then(message => console.log(message.sid));
            }).catch(error => {
              console.log(error);
            })
        } else if (/[Cc]oupon/.test(messageReceived) && /[Aa]dd/.test(messageReceived)) {
          let detailsRegex = /[Dd]etails[:, ](.*)/;
          let couponDetails;
          if (detailsRegex.test(messageReceived)) {
            couponDetails = detailsRegex.exec(messageReceived)[1].trim();
          }
  
          let addGiftcardQuery = `INSERT INTO cards(user_id,location,credit,expiration,type) VALUES($1,$2,$3,$4,$5);`;
          pool.query(addGiftcardQuery, [userId, matchLocation, couponDetails, matchDate, 'coupon'])
            .then(() => {
              client.messages
                .create({
                  body: `Your ${couponDetails} ${matchLocation} coupon has been added to your dashboard!`,
                  from: '+12015849969',
                  to: req.body.From
                })
                .then(message => console.log(message.sid));
            }).catch(error => {
              console.log(error);
            })
        } else {
          console.log("Didnt see coupon or gift card ")
          client.messages
          .create({
            body: `Sorry, I couldn't get all the info for that, please try again.`,
            from: '+12015849969',
            to: req.body.From
          })
          .then(message => console.log(message.sid));
        }
      } catch (error) {
        console.log(error)
      }
    })
    .catch(error => {
      console.log(error);
    })
  res.writeHead(200, { 'Content-Type' : 'text/xml' });
  res.end(twiml.toString());
});




// let date = new Date();
// date.setSeconds(date.getSeconds() + 1);

// new CronJob('45 12 18 * * *', function () {
//   let currentDate = new Date();
//   pool.query(`SELECT * FROM giftcards;`)
//       .then(result => {
//         let newDate;
//         for (giftcard of result.rows) {
//           newDate = new Date(giftcard.expiration);
//           newDate.setDate(newDate.getDate()-7);
//           if (currentDate > newDate) {
//             console.log('adsf');
//             client.messages
//               .create({
//                 body: `Your ${giftcard.location} giftcard: $${giftcard.amount}, expires in one week! Use it!`,
//                 from: '+12015849969',
//                 to: '+16512629188'
//               })
//               .then(message => console.log(message.sid));
//           }
//         }
//       })
// }, null, true, 'America/Resolute');

module.exports = router;