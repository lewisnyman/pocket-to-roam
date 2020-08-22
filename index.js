require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const pocketAPI = require('pocket-api');
const pocket = new pocketAPI(process.env.POCKET_CONSUMER_KEY);
pocket.setAccessToken(process.env.POCKET_ACCESS_TOKEN);

const roam = require('./roam')();
roam.go(process.env.ROAM_EMAIL, process.env.ROAM_PASS);

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
  let data = {
    title: 'Setup Pocket to Roam integration',
    pocket_consumer_text:
      'Create a Pocket consumer key and copy to your environment variables (POCKET_ACCESS_TOKEN)',
    pocket_consumer_url: 'https://getpocket.com/developer/apps/',
    link_pocket_text: 'Link your Pocket account',
    link_pocket_url: '/setup/pocket',
    copy_access_text:
      'Copy the resulting Pocket access token to your environment variables',
    roam_creds_text:
      'Copy your roam email address and password to your environment variables (ROAM_EMAIL and ROAM_PASS)',
  };

  if (process.env.POCKET_CONSUMER_KEY) {
    data.pocket_consumer_complete = true;
  }
  if (process.env.POCKET_ACCESS_TOKEN) {
    data.pocket_access_complete = true;
    data.link_pocket_complete = true;
  } else if (pocket.access_token) {
    data.copy_access_token = pocket.access_token;
    data.link_pocket_complete = true;
  }
  if (process.env.ROAM_EMAIL && process.env.ROAM_PASS) {
    data.roam_creds_compelte = true;
  }
  res.render('setup.html', data);
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
