import http from 'http';
import app from './app/app.js';

// * Server Connection
const PORT  = process.env.PORT || 6666;

const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
