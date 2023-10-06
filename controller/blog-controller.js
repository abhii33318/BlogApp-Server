const Blog = require('../model/blog')
/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         blogImage:
 *              type:string
 *         title:
 *              type:string
 *         
 *         description:
 *              type:string
 *                
 *         username:
 *           type: string
 *         category:
 *           type: string
 * 
 * /Blogs:
 *   get:
 *     summary: Get a list of all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: error
 *   post:
 *     summary: Create a new Blog
 *     description: Use this endpoint to create a new Blog.
 *     tags: [Blogs]
 *     requestBody:
 *       description: Item details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              blogImage:
 *                  type:string
 *              title:
 *                  type:string
 *         
 *              description:
 *                  type:string
 *                
 *              username:
 *                  type: string
 *              category:
 *                  type: string
 *                
 *     responses:
 *       '201':
 *         description: Item created successfully.
 *       '400':
 *         description: Bad request. Check your request data.
 */
 




 const postBlog =async(req,res)=>{
    try{
        console.log("inside blogfrnkjgn5tjkgn6")
        console.log("body",req.body)
        
        const blogDetails = req.body;
        
        const newBlog= new Blog(blogDetails);
        
        await newBlog.save();

        // console.log(req.params.id)
        return res.status(200).json({
            type:"success",
            data:{
                message:"Blog created Successfully",
                data:[]
            }
            })
    }catch(error){
        //console.log(error)
        return res.status(500).json({
            type:'error',
            data:{
                message:"blog creation failed"
            }
    })
    }
}
const updatePost = async (request, response) => {
    console.log("inside update")
    try {
        console.log("inside update")
        let blogId = request.params.id;

        delete request.params.id
        const post = await Blog.findById(blogId);

        if (!post) {
            response.status(404).json({ msg: 'blog not found' })
        }
        
        await Blog.findByIdAndUpdate( blogId, { $set: request.body })

        response.status(200).json('post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

const deletePost = async (request, response) => {
    try {
        const post = await Blog.deleteOne({_id:request.params.id});
        console.log(request.query)
        console.log("post:",post)
    
        // await post.delete()

        response.status(200).json('post deleted successfully');
    } catch (error) {
        response.status(500).json(error)
    }
}

const viewBlog = async (request,response)=>{

try{
    console.log("inside view")
    console.log(request.params.id)
    const blogDet = await Blog.find({ _id: request.params.id }).populate('created_by');
    console.log(blogDet)
    response.status(200).json(blogDet);
} catch (error) {
    response.status(500).json(error)
}
}


const blogfilter = async(req,res)=>{
try{
    let category=req.body.category
    let blogDetails = await Blog.find({category:category})

    return res.status(200).json({
        type:"success",
        data:{
            message:"Blog details fetched Successfully",
            data:blogDetails
        }
        })

}catch(error)
{
    return res.status(500).json({
        type:'error',
        data:{
            message:"unable to fetch blog details"
        }
})
}

}

const getBlogdetails = async(req,res)=>{
    try{
       
        let blogDetails = await Blog.find().populate('created_by');
    
        return res.status(200).json({
            type:"success",
            data:{
                message:"Blog details fetched Successfully",
                data:blogDetails
            }
            })
    
    }catch(error)
    {
        return res.status(500).json({
            type:'error',
            data:{
                message:"unable to fetch blog details"
            }
    })
    }
    
    }
module.exports.getBlogdetails = getBlogdetails 
module.exports.updatePost = updatePost  
module.exports.deletePost = deletePost
module.exports.blogfilter = blogfilter
module.exports.postBlog= postBlog
module.exports.viewBlog=viewBlog;