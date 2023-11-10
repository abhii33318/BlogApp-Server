const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router= express.Router()
const cors = require('cors')
router.use(cors('*'))
const corsOptions ={
    origin:['http://localhost:3000'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
router.use(cors(corsOptions));

const {signupUser,loginUser,updateProfile,getUserDetails,forgotPassword, changePassword} = require('../controller/user-controller')
const{postBlog,blogfilter,getBlogdetails,updatePost,deletePost,viewBlog,blogDraft,getDraftByUserId} = require('../controller/blog-controller')
const {uploadImage} = require('../controller/upload-controller')
const { newComment, getComments, deleteComment,updateComment }=require('../controller/commentcontroller');
const {newCategory,getCategory} = require('../controller/category-controller')
const{sendOTP,verifyOTP,updateOtp} = require('../controller/otp-controller')

router.get('/blogs',getBlogdetails)
router.get('/blogs/:id', viewBlog);

router.post('/users',signupUser)
router.put('/users/:id',updateProfile)
router.get('/users/:userId',getUserDetails)
router.post('/token',loginUser)
router.post('/blogs',postBlog)
// router.post('/blogFilter',blogfilter)
router.post('/image',upload.single('file'),uploadImage)
router.put('/blogs/:id',updatePost)
router.delete('/blogs/:id',deletePost)
router.post('/saveDraft',blogDraft)
router.get('/draft/:userId',getDraftByUserId)



router.post('/comments/:id',newComment);
router.get('/comments/:id', getComments);
router.delete('/comments/:id', deleteComment);
router.put('/comments/:id', updateComment);
router.post('/category',newCategory);
router.get('/category',getCategory)



router.post('/users/forgotPassword',forgotPassword)
router.post('/users/sentOTP',sendOTP)
router.post('/users/verifyOTP',verifyOTP)
router.put('/users/changePassword/:id',changePassword)
module.exports=router