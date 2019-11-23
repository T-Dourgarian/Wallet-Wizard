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
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});
// Retrieves any date string from sms message
// in try because I potentially already have certain data
// and I only need coupon details... so I don't need to re-extract the data from a coupons details text
// if (messageData.includes('Add') || messageData.includes('add') || gettingCouponDetails) {
// if (!matchDate) matchDate = '?'
// if (!matchAmount) matchAmount = '?'
// if (!matchLocation) matchLocation = '?' 


// algo for messages with giftcard in it
//   if (messageReceived.includes('gift card') ||
//     messageReceived.includes('giftcard') ||
//     messageReceived.includes('Giftcard') ||
//     messageReceived.includes('GiftCard') ||
//     messageReceived.includes('Gift Card')
//   ) {
//     console.log("IN GIFTCARD IF");
//     // retrieves dollar amount from giftcard

//     // selects single or consecutive words that start with a space and a Capital letter

//     console.log('Regex extraction data');
//     console.log('Restaurant / location: ', matchLocation);
//     console.log('Amount: $', matchAmount);
//     console.log('Expiration Date', matchDate);


//     // look for location in my database
//     if (matchLocation) {
//       // checks database to see if the location is an official location in the DB
//       // if it is, it sets matchLocation to that official value
//       const queryRestaurant = `SELECT name FROM locations WHERE name LIKE $1 LIMIT 1`
//       pool.query(queryRestaurant, [`%${matchLocation}%`])
//         .then(result => {
//           // checking for official location
//           if (result.rows[0]) {
//             matchLocation = result.rows[0].name;
//             console.log("official value from DB", matchLocation)
//           }
//           // adding giftcard to database
//           const queryText = `INSERT INTO giftcards(location,amount,expiration) VALUES ($1,$2,$3)`
//           pool.query(queryText, [matchLocation, matchAmount, matchDate])
//             .then(result => {
//               console.log("Success");
//               // let user know their giftcard is being adding to their dashboard
//               client.messages
//                 .create({
//                   body: `Your ${matchLocation} giftcard with $${matchAmount} is now on your dashboard. I will remind you a week before ${matchDate} to use it!`,
//                   from: '+12015849969',
//                   to: '+16512629188'
//                 })
//                 .then(message => console.log(message.sid));

//             }).catch(error => {
//               console.log("error in query", error);
//             })
//         })
//         .catch(error => {
//           console.log(error);
//         })
//     }
//     // algo for coupons
//   } else if (messageReceived.includes('coupon') || messageReceived.includes('Coupon')) {
//     console.log("IN COUPON IF");
//     // confirms location and date and asks for details
//     client.messages
//       .create({
//         body: `I am going to add a coupon for ${matchLocation} that expires on ${matchDate}. What are the details of the coupon?`,
//         from: '+12015849969',
//         to: '+16512629188'
//       })
//       .then(message => console.log(message.sid));
//     // set this to true so it hits next if statement on their response
//     gettingCouponDetails = true;
//   } else if (gettingCouponDetails) { // true after they add a coupon so I can ask for details seperately
//     console.log('getting coupon details response: ', messageReceived);
//     const queryText = `INSERT INTO coupons(location,details,expiration) VALUES ($1,$2,$3)`
//     pool.query(queryText, [matchLocation, messageReceived, matchDate])
//       .then(result => {
//         client.messages
//           .create({
//             body: `Your coupon has been added! I will remind you a week before ${matchDate} to use it.`,
//             from: '+12015849969',
//             to: '+16512629188'
//           })
//           .then(message => console.log(message.sid));
//       })
//       .catch(error => {
//         console.log('error adding coupon to db', error);
//       })
//     // done getting details, coupon added
//     gettingCouponDetails = false;
//   } else { // fail safe
//     client.messages
//       .create({
//         body: `I didn't quite understand that. Make sure to specify between 'coupon' and 'giftcard'.`,
//         from: '+12015849969',
//         to: '+16512629188'
//       })
//       .then(message => console.log(message.sid));
//   }
//   // user chooses to view their existing giftcards or coupns
// } else if (messageData.includes('View') || messageData.includes('view')) {
//   if (messageData.includes('Coupons') || messageData.includes('coupons')) {
//     // query to get all coupons
//     const queryText = `Select * FROM coupons;`;
//     pool.query(queryText)
//       .then(result => {
//         // texting every coupon to user
//         for (let coupon of result.rows) {
//           client.messages
//             .create({
//               body: `${coupon.location} coupon: ${coupon.details}, expires ${coupon.expiration}`,
//               from: '+12015849969',
//               to: '+16512629188'
//             })
//             .then(message => console.log(message.sid));
//         }
//       })
//   } else if (messageReceived.includes('gift cards') ||
//     messageReceived.includes('giftcards') ||
//     messageReceived.includes('Giftcards') ||
//     messageReceived.includes('GiftCards') ||
//     messageReceived.includes('Gift Cards')
//   ) {
//     // query to get all gift cards
//     const queryText = `Select * FROM giftcards;`;
//     pool.query(queryText)
//       .then(result => {
//         // texting every giftcard to user
//         for (let giftcard of result.rows) {
//           client.messages
//             .create({
//               body: `${giftcard.location} giftcard: $${giftcard.amount}, expires ${giftcard.expiration}`,
//               from: '+12015849969',
//               to: '+16512629188'
//             })
//             .then(message => console.log(message.sid));
//         }
//       })
//   }
// } else {
//   client.messages
//     .create({
//       body: `Sorry, I couldn't quite understand that. Make sure you specify whether you want to 'add' or 'view'.`,
//       from: '+12015849969',
//       to: '+16512629188'
//     })
//     .then(message => console.log(message.sid));
// }



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