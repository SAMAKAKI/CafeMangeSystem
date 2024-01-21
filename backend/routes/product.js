const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    let dbQuery = 'insert into product(name, categoryId, description, price, status) values(?, ?, ?, ?, "true")';
    connection.query(dbQuery, [product.name, product.categoryId, product.description, product.price], (err, result) => {
        if(!err){
            return res.status(200).json({message: "Product Added Successfully"});
        }else{
            return res.status(500).json(err);
        }
    });
})

router.get('/get', auth.authenticationToken, (req, res, next) => {
    let dbQuery = 'select p.id, p.name, p.description, p.price, p.status, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id';
    connection.query(dbQuery, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        }else{
            return res.status.json(500).json(err);
        }
    })
})

router.get('/getByCategory/:id', auth.authenticationToken, (req, res, next) => {
    const id = req.params.id;
    let dbQuery = "select id, name from product where categoryId=? and status='true'";
    connection.query(dbQuery, [id], (err, result) => {
        if(!err){
            return res.status(200).json(result);
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id', auth.authenticationToken, (req, res, next) => {
    const id = req.params.id;
    let dbQuery = 'select id, name, description, price from product where id=?';
    connection.query(dbQuery, [id], (err, result) => {
        if(!err){
            return res.status(200).json(result[0]);
        }else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    let dbQuery = 'update product set name=?, categoryId=?, description=?, price=? where id=?';
    connection.query(dbQuery, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }
            return res.status(200).json({message: "Product Updated Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    let dbQuery = 'delete from product where id=?';
    connection.query(dbQuery, [id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }
            return res.status(200).json({message: "Product Deleted Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    let dbQuery = 'update product set status=? where id=?';
    connection.query(dbQuery, [user.status, user.id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }
            return res.status(200).json({message: "Product Status Updated Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
