
const express = require('express');
require('dotenv').config();
const pool = require('./modules/pool');
const CronJob = require('cron').CronJob;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const smsRouter = require('./routes/sms.router');
const cardsRouter = require('./routes/cards.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/sms', smsRouter);
app.use('/cards', cardsRouter)

// Serve static files
app.use(express.static('build'));


new CronJob('0 0 8 * * *', function () {
  let currentDate = new Date();
  pool.query(`SELECT * FROM cards JOIN users on cards.user_id=users.id;`)
      .then(result => {
        let newDate;
        for (card of result.rows) {
          newDate = new Date(card.expiration);
          holder = new Date(card.expiration);
          newDate.setDate(newDate.getDate()-3);
          if (currentDate > newDate) {
            client.messages
              .create({
                body: `Your ${card.credit} ${card.location} ${card.type}, expires soon! Use it!`,
                from: '+12015849969',
                to: card.phone_number
              })
              .then(message => console.log(message.sid));
          }
          if(currentDate > holder) {
            pool.query(`DELETE * FROM cards`)
          }
        }
      })
}, null, true, 'America/Resolute');

// App Set //
const PORT = process.env.PORT || 5000;


/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
