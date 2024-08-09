import app from './server';

const port = 80; // ou 443 para HTTPS

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
