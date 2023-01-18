// Mailing List Updater
const express = require('express');
var cors = require('cors')
const app = express();

const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);


var whitelist = ['http://localhost:4000', 'http://127.0.0.1:4000', 'https://www.example.com']; //white list consumers

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.static('public'));
app.use(express.json())

app.options('*', cors())

app.get('/', cors(corsOptionsDelegate), (req, res) => {
  res.send('Hello human. This is your mailing list server app!!')
});

app.post('/', cors(corsOptionsDelegate), (req, res) => {
  console.log(req.body)

  const data = {
    "contacts": [
      {
        "email": req.body.email,
        "first_name": req.body.fullname
      }
    ]
  };
  
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  }
  
  client.request(request)
    .then(([response, body]) => {
      console.log(response.statusCode);
      console.log(response.body);
      res.send('success')
    })
    .catch(error => {
      console.error(error);
      res.send('error');
    });

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});