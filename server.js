const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Stockage des pseudos déjà pris
let takenNicknames = new Set();

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');
    
    // Gérer la demande de pseudo
    socket.on('set-nickname', (nickname) => {
        if (takenNicknames.has(nickname)) {
            // Si le pseudo est déjà pris, renvoyer une erreur
            socket.emit('nickname-taken');
        } else {
            // Sinon, enregistrer le pseudo et confirmer
            takenNicknames.add(nickname);
            socket.emit('nickname-set', nickname);
            console.log(`L'utilisateur ${nickname} a choisi ce pseudo`);
        }
    });

    // Gérer l'envoi des messages
    socket.on('message', (data) => {
        console.log(`${data.user}: ${data.message}`);
        io.emit('message', data); // Diffuser le message à tous les utilisateurs
    });

    // Gérer la déconnexion
    socket.on('disconnect', () => {
        takenNicknames.delete(socket.nickname); // Supprimer le pseudo à la déconnexion
        console.log('Un utilisateur s\'est déconnecté');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
