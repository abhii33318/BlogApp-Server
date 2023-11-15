const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const otpGenerator = require('otp-generator');
 
const User = require('../model/user');
const Email = process.env.EMAIL;
const Password = process.env.EMAIL_PASS;

// Send OTP to user's email
const sendOTP = async (req,res)=> {
    console.log("email is",req.body.email)
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    console.log(otp)

    let transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: Email, 
          pass: Password 
        }
      });

    const mailOptions = {
        from: Email,
        to: req.body.email,
        subject: 'OTP Verification',
        text: `Your OTP for email verification is: ${otp}`
    };

    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        await updateOtp(req.body.email, otp); // Update the OTP in the database
        res.status(200).json({ otp }); 
        return otp;
        }
        else{
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log('Error sending email: ', error);
        throw error;
    }
};

const updateOtp = async (email, otp) => {
    try {

        const filter = { email: email };
        const update = { otp: otp };
        await User.updateOne(filter, update);
    } catch (error) {
        console.log('Error updating OTP in User schema: ', error);
        throw error;
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        console.log("email is",req.body.email)
        console.log("otp is",req.body.otp)

        const user = await User.findOne({ email: req.body.email });
        console.log("user is",user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === req.body.otp) {
            
            return res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { updateOtp, sendOTP, verifyOTP };