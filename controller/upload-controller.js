const aws = require('aws-sdk');


/**
 * @swagger
 * /image:
 *   post:
 *     summary: Upload an image to AWS S3
 *     description: Use this endpoint to upload an image to AWS S3.
 *     tags: [Image Upload]
 *     requestBody:
 *       description: Image file to upload
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     data:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *       500:
 *         description: Server error
 */



const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });
  const s3 = new aws.S3();
  
const uploadImage = async(req,res)=>{
    try {
        const { originalname, buffer } = req.file;
        console.log(buffer)
        const params = {
          Bucket: "blogsphere-ab",
          ACL: "public-read",
          ContentType: req.file.mimetype,
          Key: originalname,
          Body: buffer
        };
    
        const uploadedFile = await s3.upload(params).promise();
    
       console.log(uploadedFile.Location)
    //    res.send(uploadedFile.Location)
    
    return res.status(200).json({
        type:"success",
        data:{
            message:"image uploaded Successfully",
            data:{
                imageUrl:uploadedFile.Location
            }
        }
        })
    
    
        
    } catch (error) {
        
    }
}
module.exports.uploadImage= uploadImage