import 'angular2-universal/polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Angular 2 Universal
import {
  provide,
  enableProdMode,
  expressEngine,
  REQUEST_URL,
  ORIGIN_URL,
  BASE_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_HTTP_PROVIDERS,
  ExpressEngineConfig
} from 'angular2-universal';

import {AppComponentv2} from './client/app/app.component';

const app = express();

app.engine('.html', expressEngine);
app.set('views', path.join(path.resolve(__dirname, './client')));
app.set('view engine', 'html');
app.use(bodyParser.json());

function ngApp(req, res) {
  let baseUrl = '/';
  let url = req.originalUrl || '/';

  let config: ExpressEngineConfig = {
    directives: [ AppComponentv2 ],
    platformProviders: [
      provide(ORIGIN_URL, {useValue: 'http://localhost:3000'}),
      provide(BASE_URL, {useValue: baseUrl}),
    ],
    providers: [
      provide(REQUEST_URL, {useValue: url}),
      NODE_ROUTER_PROVIDERS,
      NODE_HTTP_PROVIDERS,
    ],
    //server: false,
    async: true,
    preboot: false // { appRoot: 'app' } // your top level app component selector
  };

  res.render('index', config);
}

app.use('/app', express.static(path.join(path.resolve(__dirname, './client/app')), {index: false}));
app.use('/assets', express.static(path.join(path.resolve(__dirname, './client/assets')), {index: false}));
app.use('/scripts', express.static(path.join(path.resolve(__dirname, './client/scripts')), {index: false}));
app.use('/node_modules', express.static(path.join(path.resolve(__dirname, "../node_modules")), {index: false}));

app.use('/', ngApp);

// Server
app.listen(3000, () => {
  console.log('Listening on: http://localhost:3000');
});
