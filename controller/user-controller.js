const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const common = require('../common/common')

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

const updateProfile = async (req, res) => {
    try {
      const userId = req.params.id; 
      const { name, email, profileImage, instagramLink, linkedinLink, facebookLink } = req.body;
  
      await User.findByIdAndUpdate(userId, {
        name,
        email,
        profileImage,
        instagramLink,
        linkedinLink,
        facebookLink,
      });
  
      return res.status(200).json({
        type: 'success',
        data: {
          message: 'User profile updated successfully',
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: 'error',
        data: {
          message: 'User profile update failed',
        },
      });
    }
  };

  const getUserDetails = async (req,res) =>{

    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({
            type: 'error',
            data: {
              message: 'User not found',
            },
          });
        }
    
        // Return the user data as a response
        return res.status(200).json({
          type: 'success',
          data: {
            user, // Return the user object
          },
        });
      } catch (error) {
        console.error('Error fetching user data: ', error);
        return res.status(500).json({
          type: 'error',
          data: {
            message: 'Internal server error',
          },
        });
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
        
        console.log("password1",request.body.password)
        console.log("password2",user.password)
        console.log(match)
        if (match) {
            
            let payload = {
              _id:user._id,
              username:user.username
            }
            const token = await common.token(payload)
            console.log(token)
        
            response.status(200).json({
                type:"success",
                data:{
                message:"User registration was Successful",
                data:{
                    accessToken: token,
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
const forgotPassword =async(req,res)=>{

  try {
    console.log(req.body)
    const { email, newPassword } = req.body;
    

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password and update the user's password
    req.body.newPassword = await bcrypt.hash(newPassword, 10);
    user.password = req.body.newPassword;

    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
}
catch (error) {
  
    console.log(error);
    return res.status(500).json({ message: 'Error while resetting password' });
} 

}
const changePassword = async (request, response) => {
  try {
      console.log("inside")
       console.log("Change Password",request.body)
       console.log("User_id:",request.params.id);
      const user = await User.findOne({ _id:request.params.id});
      console.log(user)
      if (!user) {
          return response.status(404).json({ message: 'User not found' });
      }

      const inputPassword = request.body.currentpassword.trim();
      const passwordFromDB = user.password
      const isPasswordValid = await bcrypt.compare(inputPassword, passwordFromDB);
      console.log("password",isPasswordValid)

      if (!isPasswordValid) {
          return response.status(401).json({ message: 'Current password is incorrect' });
      }

  
      const newPasswordHash = await bcrypt.hash(request.body.newPassword, 10);
      console.log("newPasswordHash",newPasswordHash);
      user.password = newPasswordHash;
      await user.save();

      return response.status(200).json({ message: 'Password changed successfully' });
  }
  catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Error while changing password' });
  }
};


module.exports.loginUser=loginUser
module.exports.signupUser=signupUser
module.exports.updateProfile=updateProfile
module.exports.getUserDetails=getUserDetails
module.exports.forgotPassword=forgotPassword
module.exports.changePassword=changePassword
