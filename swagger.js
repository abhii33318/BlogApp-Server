const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for Blog application.',
      contact: {
        name: "Abhijith P", // your name
        email: "abhijith.p@pumexinfotech.com" // your email
      }
    },
    servers: [
        { url: 'http://localhost:8000', description: 'Development Server (HTTP)' }
        
    ],
  },
  
  apis: ['./controller/*.js'] // Specify your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;