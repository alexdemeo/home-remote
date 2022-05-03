const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');

require('dotenv').config();

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

const [ADDR_ROKU, ADDR_COFFEE, ADDR_STATION] = ['ADDR_ROKU', 'ADDR_COFFEE', 'ADDR_STATION'].map(
  addr => process.env[addr],
);

if (![ADDR_ROKU, ADDR_COFFEE, ADDR_STATION].every(Boolean)) {
  throw new Error('Must provide all of [ADDR_ROKU, ADDR_COFFEE, ADDR_STATION] env vars');
}

app.use(endpoints.roku, (req, res, next) => proxy(ADDR_ROKU)(req, res, next));
app.use(endpoints.coffee, (req, res, next) => proxy(ADDR_COFFEE)(req, res, next));
app.use(endpoints.station, (req, res, next) => proxy(ADDR_STATION)(req, res, next));

app.all('/', (req, res) => {
  console.log('response static to', req.hostname, 'ip', req.ip, 'path', req.path, 'with', res.statusCode);
  res.sendFile(indexPath);
});

app.listen(PORT, HOST, () => {
  console.log('Express server listening on port ' + PORT);
});
