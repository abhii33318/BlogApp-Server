const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const db= require('./database/db')
const router=require('./routes/route')
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{ explorer: true }));
app.use('/',router)




const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

