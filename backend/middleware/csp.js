// Middleware para Content-Security-Policy
module.exports = app => {
  app.use((req, res, next) => {
    // res.setHeader('Content-Security-Policy', "default-src 'self' http: https: data: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https: ws: wss:;");
    next();
  });
};
