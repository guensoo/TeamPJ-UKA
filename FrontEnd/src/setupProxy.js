const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://192.168.3.24:8888',
      ws: true
    })
  );
};