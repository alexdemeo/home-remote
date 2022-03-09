const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');

const PORT = +(process.env.PORT || 80);
const HOST = '0.0.0.0';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const staticPath = path.join(__dirname, 'build', 'static');
const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(__dirname, 'build', 'index.html');

const endpoints = {
  roku: '/roku',
  coffee: '/coffee',
  station: '/station',
};

app.use((req, res, next) => {
  if (Object.values(endpoints).includes(req.path)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

app.use('/', express.static(buildPath));
app.use('/static', express.static(staticPath));

app.use(endpoints.roku, (req, res, next) => proxy('192.168.1.225:8060')(req, res, next));
app.use(endpoints.coffee, (req, res, next) => proxy('pi3.local:5000')(req, res, next));
app.use(endpoints.station, (req, res, next) => proxy(`pi2.local:5555`)(req, res, next));

app.all('/', (req, res) => {
  console.log('response static to', req.hostname, 'ip', req.ip, 'path', req.path, 'with', res.statusCode);
  res.sendFile(indexPath);
});

app.listen(PORT, HOST, function () {
  console.log('Express server listening on port ' + PORT);
});
