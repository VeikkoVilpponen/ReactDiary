import express from 'express';
import { PrismaClient } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

const prisma = new PrismaClient();

const apiRouter: express.Router = express.Router();

apiRouter.use(express.json());

apiRouter.delete("/entries/:id", async (req: express.Request, res: express.Response): Promise<void> => {

    let entries = await prisma.entry.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.json(entries);
});

apiRouter.post("/entries", async (req: express.Request, res: express.Response): Promise<void> => {
    let entries = await prisma.entry.create({
        data: {
            title: req.body.title,
            content: sanitizeHtml(req.body.content)
        }
    });
    res.json(entries);
});

apiRouter.get("/entries", async (req: express.Request, res: express.Response): Promise<void> => {
    let entries = await prisma.entry.findMany();
    res.json(entries);
});

export default apiRouter;