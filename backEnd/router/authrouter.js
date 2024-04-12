const express = require("express");
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {sign, login , logout,forget_password,reset_password , reset  }= require('../controllers/authcontrollers')
// ==================================================       sign         =========================================
router.post('/sign',sign)
//===============================================        login      =============================================
router.post('/login',login)
//===================================================== logout =============================================
router.get('/logout',logout)
// =======================================================  mot de passe oublier ========================================
router.post("/forget-password",forget_password)
// = ======================================== reset ============================
router.get('/reset-password/:id/:token',reset )
//========================================================   reset password ================================
router.post("/reset-password/:id/:token",reset_password)

module.exports = router