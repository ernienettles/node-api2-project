const express = require("express");

const router = express.Router();

const db = require("../data/db");

router.post("/", async (req, res) => {
    try {
        const { title, contents } = req.body;

        if (!title || !contents) {
            return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        }

        const post = await db.insert({ title, contents });

        res.status(201).json({ ...post, title, contents });
    } catch {
        res.status(500).json({ message: "There was an error while saving the post to the database" });
    }
});

router.post("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const post = await db.findById(id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        if (!text) {
            return res.status(400).json({ errorMessage: "Please provide text for the comment." });
        }

        const commentId = await db.insertComment({ post_id: id, text });
        const comment = await db.find(commentId.id);

        res.status(201).json(comment);
    } catch {
        res.status(500).json({ errorMessage: "Please provide text for the comment." });
    }
});

router.get("/", async (req, res) => {
    try {
        const posts = await db.find();

        res.status(200).json(posts);
    } catch {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await db.findById(id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        res.status(200).json(post);
    } catch {
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

router.get("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await db.findById(id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        const comments = await db.findPostComments(id);

        res.status(200).json(comments);
    } catch {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await db.findById(id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        await db.remove(id);

        res.status(200).json(post);
    } catch {
        res.status(500).json({ error: "The post could not be removed" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params;
        const { title, contents } = req.body;
        const post = await db.findById(id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not excist." });
        }

        if (!title || !contents) {
            return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }

        const newPost = post.update(id, req.body);

        res.status(200).json(newPost);
    } catch {
        res.status(500).json({ error: "The post information could not be modified." })
    }
});

module.exports = router;
