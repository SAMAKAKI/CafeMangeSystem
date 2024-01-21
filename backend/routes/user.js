const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/signup', (req, res, next) => {
    let user = req.body;
    let dbQuery = 'select email, password, role, status from user where email=?';
    connection.query(dbQuery, [user.email], (err, result) => {
        if(!err){
            if(result.length <= 0){
                dbQuery = "insert into user(name, contactNumber, email, password, status, role) values(?, ?, ?, ?, 'false', 'user')";
                connection.query(dbQuery, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if(!err){
                        return res.status(200).json({message: 'Successfully Registered'});
                    }else{
                        return res.status(500).json(err);
                    }
                })
            }else{
                return res.status(400).json({message: "Email Already Exist."})
            }
        }
        else{
            return res.status(500).json(err)
        }
    });
});

router.post('/login', (req, res) => {
    const user = req.body;
    let dbQuery = "select email, password, role, status from user where email=?";
    connection.query(dbQuery, [user.email], (err, result) => {
        if(!err){
            if(result.length <= 0 || result[0].password != user.password){
                return res.status(401).json({message: 'Incorrect Username or Password'});
            }else if(result[0].status === 'false'){
                return res.status(401).json({message: 'Wait for Admin Approval'});
            }else if(result[0].password == user.password){
                const response = {
                    email: result[0].email,
                    role: result[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'});
                res.status(200).json({token: accessToken});
            }else{
                return res.status(400).json({message: 'Something went wrong. Please try again later'});
            }
        }
        else{
            return res.status(500).json(err)
        }
    });
});

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    let dbQuery = 'select email, password from user where email=?';
    connection.query(dbQuery, [user.email], (err, result) =>{
        if(!err){
            if(result.length <= 0){
                return res.status(200).json({message: 'This email address invalid'});
            } else{
                let mailOptions = {
                    from: '"SAMAKAKI Cafe Management System" <my@company.com>', // process.env.EMAIL
                    to: result[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your Login details for Cafe Management System</b><br><b>Email:</b>'+result[0].email+'<br><b>Password:</b>'+result[0].password+'<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions, (error, info) =>{
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent: '+info.process)
                    }
                });
                return res.status(200).json({message: 'Password sent successfully to your email'});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let dbQuery = "select id, name, email, contactNumber, status from user where role='user'";
    connection.query(dbQuery, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        }else{
            res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    let dbQuery = 'update user set status=? where id=?';
    connection.query(dbQuery, [user.status, user.id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: 'User id does not exist'});
            }
            return res.status(200).json({message: "User Updated Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({message: 'true'});
})

router.post('/changePassword', auth.authenticationToken, (req, res) => {
     const user = req.body;
     const email = res.locals.email;
     let dbQuery = 'select * from user where email=? and password=?';
     connection.query(dbQuery, [email, user.oldPassword], (err, result) => {
        if(!err){
            if(result.length <= 0)
                return res.status(400).json({message: "Incorrect Old Password"});
            else if(result[0].password == user.oldPassword){
                dbQuery = "update user set password=? where email=?";
                connection.query(dbQuery, [user.newPassword, email], (err, result) => {
                    if(!err)
                        return res.status(200).json({message: "Password Updated Successfully"});
                    else
                        return res.status(500).json(err);
                })
            }else
                return res.status(400).json({message: "Something went wrong. Please try again later"});
        }
        else
            return res.status(500).json(err);
     })
})

module.exports = router
