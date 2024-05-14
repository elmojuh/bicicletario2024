import express, { Request, Response } from 'express';
import db from './config/db'; // Importe o arquivo de configuração do banco de dados
import routes from "./routes/routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api',routes)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

export default app;
