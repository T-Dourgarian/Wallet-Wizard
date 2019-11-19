const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();


router.get('/',rejectUnauthenticated,(req,res) => {
    const queryText = `SELECT * FROM cards ORDER BY id DESC;`;
    pool.query(queryText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
})


router.put('/:id',rejectUnauthenticated,(req,res) => {
    const queryText = 
    `UPDATE cards
        SET location=$1,
            credit=$2,
            expiration=$3
        WHERE id=$4;
    `;

    pool.query(queryText,[req.body.location,req.body.credit,req.body.expiration,req.params.id])
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
})


router.post('/',rejectUnauthenticated,(req,res) => {
    const queryText = `INSERT INTO cards(user_id,location,credit,expiration,type) VALUES($1,$2,$3,$4,$5);`

    pool.query(queryText,[req.user.id,req.body.location,req.body.credit,req.body.expiration,req.body.type])
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
})


module.exports = router;