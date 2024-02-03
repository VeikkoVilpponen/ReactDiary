import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import users, { User } from '../models/users';

const authRouter: express.Router = express.Router();

authRouter.use(express.json()); // Receive possible request body as JSON data

authRouter.post("/login", async (req: express.Request, res: express.Response): Promise<void> => {

    try {
       
        let user: User = await users.getUser(req.body.username);

        if (user) {

            let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");
            
            if (user.password === hash) 
            {
                let token = jwt.sign({ id: user.userId, username: user.username }, String(process.env.ACCESS_TOKEN_SECRET), { algorithm: "HS256" }); 

                res.status(200).json({"token": token});

            } else {
                  res.status(401).json({ "message": "Invalid username or password" });
            }          

        } else {
            res.status(401).json({ "message": "Invalid username or password" });
        }

    } catch (e: any) {
        res.status(e.status).json({ "message": e.text });
    }
});

export default authRouter;