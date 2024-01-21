const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    let dbQuery = 'insert into category (name) values (?)';
    connection.query(dbQuery, [category.name], (err, result) => {
        if(!err)
            return res.status(200).json({message: "Category Added Successfully"});
        else
            return res.status(500).json(err);
    })
})

router.get('/get', auth.authenticationToken, (req, res, next) => {
    let dbQuery = "select * from category order by name";
    connection.query(dbQuery, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        } else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    let dbQuery = "update category set name=? where id=?";
    connection.query(dbQuery, [product.name, product.id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0)
                return res.status(404).json({message: 'Category id does not found'})

            return res.status(200).json({message: 'Category Updated Successfully'});
        } else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
