import express, { Request, Response } from 'express';
import AppRoutes from "./routes/routes";

const app = express();

app.use(express.json());
app.use('/api', new AppRoutes().router);
app.get('/', (req: Request, res: Response) => {
    res.send('Bicicletario acesse a rota /api');
});

export default app;
