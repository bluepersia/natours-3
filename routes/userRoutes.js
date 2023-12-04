const express = required ('express');
const authController = require ('../controllers/authController');

const router = express.Router ();

router.post ('signup', authController.signup);