const homeRouter=require('./home');
const apiRouter=require('./api')
function route(app) { 
  app.use('/',homeRouter);
  app.use('/api',apiRouter);
}

module.exports = route;