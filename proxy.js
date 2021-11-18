const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const app = express();

const PORT = +(process.env.PORT || 80);
const HOST = '0.0.0.0';

app.use(cors());
app.use(morgan('dev'));

app.use('/static', express.static(path.join(__dirname, 'build//static')));

app.get('/*', (req, res) => {
  console.log('response static to', req.hostname, 'ip', req.ip, 'path', req.path);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/roku', proxy('192.168.1.226:8060'));
app.use('/coffee', proxy('pi3.local:5000'));
app.use('/printer', proxy('pi2.local:5555'));

app.listen(PORT, HOST, function () {
  console.log('Express server listening on port ' + PORT);
});
