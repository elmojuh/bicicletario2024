import app from './server';
import db from './config/db';

const port = 3000;

db.then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Erro ao conectar-se ao MongoDB:', error);
    process.exit(1);
});
