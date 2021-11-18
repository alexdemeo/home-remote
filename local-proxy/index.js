const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('express-http-proxy');
const app = express();

const PORT = 4001;
const HOST = 'localhost';

app.use(cors());
app.use(morgan('dev'));

app.use('/roku', proxy('192.168.1.226:8060'));
app.use('/coffee', proxy('pi3.local:5000'));
app.use('/printer', proxy('pi2.local:5555'));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
