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
  // enters if I can find number in my db
  pool.query(getUserQuery, [req.body.From])
    .then(result => {
      userId = result.rows[0].id


      let matchDate;
      let matchLocation;
      let matchAmount
      // tries to get all data
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
          matchAmount = amountRegex.exec(messageReceived)[0];
        }

        // ADD GIFTCARD
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
          // ADD COUPON
        } else if (/[Cc]oupon/.test(messageReceived) && /[Aa]dd/.test(messageReceived)) {
          let detailsRegex = /[Aa]dd([a-z, ,A-Z,0-9,$%]*)[A-Z]/;
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
          // VIEW ALL CARDS
        } else if (messageReceived === 'Show me the money') {
          let date;
          pool.query(`SELECT * FROM cards WHERE user_id=${userId}`)
            .then(result => {
              for (card of result.rows) {
                date = card.expiration.getMonth() + 1 + "-" + card.expiration.getDate() + '-' + card.expiration.getFullYear();
                client.messages
                  .create({
                    body: `${card.credit} ${card.location} ${card.type} expires on ${date}`,
                    from: '+12015849969',
                    to: req.body.From
                  })
                  .then(message => console.log(message.sid));
              }
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
        client.messages
          .create({
            body: `Sorry, I couldn't get all the info for that, please try again.`,
            from: '+12015849969',
            to: req.body.From
          })
          .then(message => console.log(message.sid));
      }
    })
    .catch(error => {
      console.log(error);
    })
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

router.post('/initial', (req, res) => {
  client.messages
    .create({
      body: `Welcome to Wallet Wizard! You can add or view your gift cards and coupons right here! `,
      from: '+12015849969',
      to: req.body.phoneNumber
    })
    .then(message => console.log(message.sid));
})

new CronJob('0 0 8 * * *', function () {
  let currentDate = new Date();
  pool.query(`SELECT cards.id,location,credit,type,phone_number, expiration FROM cards JOIN users on cards.user_id=users.id;`)
    .then(result => {
      let newDate;
      let holder;
      for (card of result.rows) {
        newDate = new Date(card.expiration);
        holder = new Date(card.expiration);
        newDate.setDate(newDate.getDate() - 3);
        if (currentDate > newDate) {
          client.messages
            .create({
              body: `Your ${card.credit} ${card.location} ${card.type} expires soon! Use it!`,
              from: '+12015849969',
              to: card.phone_number
            })
            .then(message => console.log(message.sid));
        }
        if (currentDate >= holder.setDate(holder.getDate() + 1)) {
          pool.query(`DELETE FROM cards WHERE id=${card.id};`)
            .then(result => {
              console.log('In deleted')
            }).catch(error => {
              console.log(error);
            })
        }
      }
    }).catch(error => {
      console.log(error);
    })
}, null, true, 'America/Resolute');




module.exports = router;