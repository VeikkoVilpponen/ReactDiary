import express, {NextFunction} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import authRouter from './routes/auth';
import cors from 'cors';
import jwt from 'jsonwebtoken';


dotenv.config({ path: path.resolve(__dirname, ".env") });

const app: express.Application = express();

const checkToken = (req: express.Request, res: express.Response, next: NextFunction): NextFunction | void => {
    
    try {

        let token: string | undefined = req.headers.authorization!.split(" ")[1];
      
        let payload =  jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET), { algorithms: ["HS256"] });

        next();

    } catch (e: any) {

        res.status(401).json({ "error": "Access denied" });

    }
}

app.use(cors({
    "origin": "*",
    "optionsSuccessStatus": 204 
}));

app.use("/auth/", authRouter);
app.use("/api", checkToken, apiRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listening to port ${process.env.PORT}`);    
});