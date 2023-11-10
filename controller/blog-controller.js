const Blog = require('../model/blog');

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         blogImage:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         username:
 *           type: string
 *         category:
 *           type: string
 *
 * /blogs:
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
 *         description: Server error
 *   post:
 *     summary: Create a new Blog
 *     description: Use this endpoint to create a new Blog.
 *     tags: [Blogs]
 *     requestBody:
 *       description: Blog details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Server error
 *
 * /blogs/{id}:
 *   put:
 *     summary: Update a Blog by ID
 *     description: Use this endpoint to update an existing Blog by ID.
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the Blog to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated Blog details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a Blog by ID
 *     description: Use this endpoint to delete an existing Blog by ID.
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the Blog to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get a Blog by ID
 *     description: Use this endpoint to retrieve a Blog by ID.
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the Blog to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 *
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


const blogDraft=async (req, res) => {
    try {
      const blogDetails = req.body;
      console.log(blogDetails)
  
      const newBlog = new Blog({
        ...blogDetails,
        status: 'draft', // Set status to "draft" when creating a draft post
      });
      

      console.log("new blog is",newBlog)
  
      const savedBlog = await newBlog.save();
      res.status(200).json(savedBlog);
    } catch (error) {
      console.error('Error creating draft blog post:', error);
      res.status(500).json({ error: 'Could not create draft blog post' });
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
       
        let blogDetails = await Blog.find({ status: 'published' }).populate('created_by');

    
        return res.status(200).json({
            type:"success",
            data:{
                message:"Blog details fetched Successfully",
                data:blogDetails
            }
            })
    
    }catch(error)
    {
      console.log(error)
        return res.status(500).json({
            type:'error',
            data:{
                message:"unable to fetch blog details"
            } 
           
    })
    }
    
    }

    const getDraftByUserId = async (req, res) => {
        try {
          // Extract the user ID from the request parameters
          const userId = req.params.userId; 
          // Assuming you pass the user's ID in the URL
          console.log("getDraftByUserId",userId)
      
          
          let blogDetails = await Blog.find({
            status: 'draft',
            created_by: userId, // Filter by the user's ID
          });
      
          return res.status(200).json({
            type: 'success',
            data: {
              message: 'Draft blog details fetched successfully',
              data: blogDetails,
            },
          });
        } catch (error) {
          return res.status(500).json({
            type: 'error',
            data: {
              message: 'Unable to fetch draft blog detail',
            },
          });
        }
      };

      
      
module.exports.getBlogdetails = getBlogdetails 
module.exports.updatePost = updatePost  
module.exports.deletePost = deletePost
module.exports.blogfilter = blogfilter
module.exports.postBlog= postBlog
module.exports.viewBlog=viewBlog;
module.exports.blogDraft = blogDraft;
module.exports.getDraftByUserId = getDraftByUserId;

