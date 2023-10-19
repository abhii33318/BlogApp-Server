const category = require('../model/category')
const newCategory = async (req, res) => {
    try {
        const categoryDetails = req.body;
        // Extract the user ID from the request
        const userId = categoryDetails.userId;

        // Create a new category object with user ID
        const newCategory = new category({
            category: categoryDetails.name,
            created_by: userId,
        });

        await newCategory.save();

        return res.status(200).json({
            type: 'success',
            data: {
                message: 'New Category created successfully',
                category: newCategory,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'error',
            data: {
                message: 'Category creation failed'
            }
        });
    }
};

const getCategory = async (request, response) => {
    try {
      
      const categories = await category.find({});
      response.status(200).json(categories);
    } catch (error) {
      response.status(500).json(error);
    }
  };

module.exports.newCategory = newCategory;
module.exports.getCategory = getCategory;