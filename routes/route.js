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

const {signupUser,loginUser} = require('../controller/user-controller')
const{postBlog,blogfilter,getBlogdetails,updatePost,deletePost,viewBlog} = require('../controller/blog-controller')
const {uploadImage} = require('../controller/upload-controller')
const { newComment, getComments, deleteComment }=require('../controller/commentcontroller');


router.get('/Blogs',getBlogdetails)
router.get('/Blogs/:id', viewBlog);

router.post('/Users',signupUser)
router.post('/login',loginUser)
router.post('/Blogs',postBlog)
// router.post('/blogFilter',blogfilter)
router.post('/Image',upload.single('file'),uploadImage)
router.put('/Blogs/:id',updatePost)
router.delete('/Blogs/:id',deletePost)


router.post('/comments/:id',newComment);
router.get('/comments/:id', getComments);
router.delete('/comments/:id', deleteComment);

module.exports=router