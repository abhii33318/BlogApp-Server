const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *
 * /users:
 *   post:
 *     summary: User registration
 *     description: Use this endpoint to register a new user.
 *     tags: [Users]
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registration successful
 *       400:
 *         description: User already exists with the same username
 *       500:
 *         description: Server error
 *
 * /token:
 *   post:
 *     summary: User login
 *     description: Use this endpoint to log in an existing user.
 *     tags: [Users]
 *     requestBody:
 *       description: User login details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successful
 *       400:
 *         description: Username or password does not match
 *       500:
 *         description: Server error during login
 */


console.log(User)
 const signupUser =async(req,res)=>{
    try{
        console.log("inside signup")
        // console.log(req)
        const { username, email, password, confirmPassword } = req.body
        req.body.password = await bcrypt.hash(req.body.password,10)
        const user = req.body;
        console.log(user)

        const existingUser = await User.findOne({username});

        if (existingUser) {
        return res.status(400).json({ 
            status:false,
            message: 'User already exists with this email' });
        }
        const newUser= new User(user);
        console.log(newUser)
        await newUser.save();
        return res.status(200).json({
            type:"success",
            data:{
                message:"User registration was Successful",
                data:[]
            }
            })
    }

    
    catch(error){
        console.log(error)
        return res.status(500).json({
            type:'error',
            data:{
                message:"User registration failed"
            }
    })
    }
}

const loginUser = async(request,response)=>{
    console.log(request.body)
    let user = await User.findOne({ username: request.body.username });
    console.log(user)
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        const hashPassword = await bcrypt.hash(request.body.password,10)

        let match = await bcrypt.compare(request.body.password, user.password);
        // req.body.password = await bcrypt.hash(req.body.password,10)
        console.log("password1",request.body.password)
        console.log("password2",user.password)
        console.log(match)
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            console.log(accessToken)

            // const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            // const newToken = new Token({ token: refreshToken });
            // await newToken.save();
        
            response.status(200).json({
                type:"success",
                data:{
                message:"User registration was Successful",
                data:{
                    accessToken: accessToken,
                    name: user.name, 
                    username: user.username,
                    userId : user._id
                }
                }
                  });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        console.log(error)
        response.status(500).json({ msg: 'error while login the user' })
    }
}

// const logoutUser = async (request, response) => {
//     const token = request.body.token;
//     await Token.deleteOne({ token: token });

//     response.status(204).json({ msg: 'logout successfull' });
// }

module.exports.loginUser=loginUser
module.exports.signupUser=signupUser
// module.exports.logoutUser=logoutUser