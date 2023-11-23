const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3300;
const postsRouter = require('./routers/postsRouter');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

server.use(bodyParser.json());
server.use('/', postsRouter);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
