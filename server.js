const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Permet à n'importe quelle origine de se connecter
        methods: ['GET', 'POST']
    }
});

// Servir les fichiers frontend depuis le dossier public
app.use(express.static('public'));

// Lorsqu'un utilisateur se connecte
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');
    
    // Lorsqu'un message est reçu
    socket.on('message', (message) => {
        console.log('Message reçu:', message);
        // Diffuse le message à tous les autres utilisateurs
        io.emit('message', message);
    });

    // Lorsqu'un utilisateur se déconnecte
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

// Lancer le serveur sur un port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
