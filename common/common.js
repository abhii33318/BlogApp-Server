const jwt = require('jsonwebtoken');
const secretKey = 'dshbndsh21e123#gbngvhgcvb';
const token = async (payload)=> jwt.sign(payload, secretKey, { expiresIn: '1h' });


const verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
  
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1]; 
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          
          return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; 
        next(); 
      });
    } else {
      
      return res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports.token = token
module.exports.verifyToken = verifyToken