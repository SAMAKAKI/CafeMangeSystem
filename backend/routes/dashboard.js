const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.get('/details', auth.authenticationToken, (req, res, next) => {
    let categoryCount;
    let productCount;
    let billCount;
    let dbQuery = 'select count(id) as categoryCount from category';
    connection.query(dbQuery, (err, result) => {
        if(!err){
            categoryCount = result[0].categoryCount;
        }else{
            return res.status(500).json(err);
        }
    })

    dbQuery = 'select count(id) as productCount from product';
    connection.query(dbQuery, (err, result) => {
        if(!err){
            productCount = result[0].productCount;
        }else{
            return res.status(500).json(err);
        }
    })

    dbQuery = 'select count(id) as billCount from bill';
    connection.query(dbQuery, (err, result) => {
        if(!err){
            billCount = result[0].billCount;
            let data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            }
            return res.status(200).json(data);
        }else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
