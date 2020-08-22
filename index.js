require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const needle = require('needle');
const pocketAPI = require('pocket-api');
const pocket = new pocketAPI(process.env.POCKET_CONSUMER_KEY);

app.use(
  helmet({
    dnsPrefetchControl: { allow: true },
  })
);

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/setup', async function (req, res) {
  if (pocket.access_token) {
    res.render('setup.html', {
      title: 'Setup Pocket to Roam integration',
      link_text: 'Link your Pocket account',
      link_url: '/setup/pocket',
      complete: true,
    });
    return;
  }
  res.render('setup.html', {
    title: 'Setup Pocket to Roam integration',
    link_text: 'Link your Pocket account',
    link_url: '/setup/pocket',
  });
});

app.get('/setup/pocket', async function (req, res) {
  pocket
    .getRequestToken()
    .then((response) => {
      pocket.setRequestToken(response);
      const redirectUrl =
        req.protocol +
        '://' +
        req.hostname +
        ':' +
        port +
        '/setup/pocket/callback';
      const pocketUrl =
        'https://getpocket.com/auth/authorize?request_token=' +
        response +
        '&redirect_uri=' +
        redirectUrl;
      res.redirect(pocketUrl);
    })
    .catch(function (e) {
      console.error(e);
    });
});

app.get('/setup/pocket/callback', async function (req, res) {
  pocket
    .getAccessToken()
    .then((response) => {
      pocket.setAccessToken(response.access_token);
      res.redirect('/setup');
    })
    .catch(function (e) {
      console.error(e);
    });
});
app.get('/pocket', async function (req, res) {
  pocket.getArticles().then((response) => {
    console.log(response);
    res.send(response);
  });
});

app.listen(port, (err) => {
  console.log('Listening on', port);
  if (err) {
    throw err;
  }
});
