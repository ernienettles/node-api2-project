const express = require("express");

const server = express();

const postsRouter = require("./routers/postsRouter.js")

const PORT = 9000;

server.use(express.json());

server.use('/api/posts', postsRouter);

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
});

