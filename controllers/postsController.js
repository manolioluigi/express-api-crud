const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugify = require('slugify');

//CONTROLLER

// crea un nuovo post
async function createPost(req, res) {
    try {
        const { title, image, content, published } = req.body;
        const slug = await generateUniqueSlug(title);

        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                image,
                content,
                published,
            },
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error('Errore durante la creazione del post:', error);
        res.status(500).json({ success: false, error: 'Errore durante la creazione del post' });
    }
}

// cerca un post utilizzando lo slug
async function getPostBySlug(req, res) {
    try {
        const { slug } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                slug,
            },
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post non trovato' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error('Errore durante il recupero del post:', error);
        res.status(500).json({ success: false, error: 'Errore durante il recupero del post' });
    }
}

// recupera tutti i post
async function getAllPosts(req, res) {
    try {
        const allPosts = await prisma.post.findMany();

        res.status(200).json({ success: true, data: allPosts });
    } catch (error) {
        console.error('Errore durante il recupero di tutti i post:', error);
        res.status(500).json({ success: false, error: 'Errore durante il recupero di tutti i post' });
    }
}

// aggiorna un post utilizzando lo slug
async function updatePost(req, res) {
    try {
        const { slug } = req.params;
        const { title, image, content, published } = req.body;

        const updatedPost = await prisma.post.update({
            where: {
                slug,
            },
            data: {
                title,
                slug: await generateUniqueSlug(title),
                image,
                content,
                published,
            },
        });

        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del post:', error);
        res.status(500).json({ success: false, error: 'Errore durante l\'aggiornamento del post' });
    }
}

// elimina un post utilizzando lo slug
async function deletePost(req, res) {
    try {
        const { slug } = req.params;

        const existingPost = await prisma.post.findUnique({
            where: {
                slug,
            },
        });

        if (!existingPost) {
            return res.status(404).json({ success: false, error: 'Post non trovato' });
        }

        await prisma.post.delete({
            where: {
                slug,
            },
        });

        res.status(200).json({ success: true, message: 'Post eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione del post:', error);
        res.status(500).json({ success: false, error: 'Errore durante l\'eliminazione del post' });
    }
}

// crea slug unici
async function generateUniqueSlug(title) {
    const trimmedTitle = title.trim();
    const newSlug = slugify(trimmedTitle, { lower: true });

    const existingPostWithSlug = await prisma.post.findFirst({
        where: {
            slug: newSlug,
            NOT: {
                slug: existingSlug,
            },
        },
    });

    if (existingPostWithSlug) {
        return `${newSlug}-${Date.now()}`;
    } else {
        return newSlug;
    }
}


module.exports = {
    createPost,
    getPostBySlug,
    getAllPosts,
    updatePost,
    deletePost,
};
