const aws = require('aws-sdk');

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