const express = require('express');
const app = express();
const PORT = 4040;


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// templating engine
app.set('view engine', 'ejs');



// url object which will store short ULR versions
const urlDB = {
  "xxc2y" : "https://www.lighthouselabs.ca",
  "9m5xk" : "https://www.google.com"
};

app.get("/", (req, res) => {
  res.send('Hi there!');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDB);
});

app.get('/urls', (req, res) => {
  let tempVar = {urls: urlDB};
  res.render('urls_index', tempVar)
})

// new URL with submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


//on form submit via POST
app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok');
})

// dynamic URL form URL DB/object
app.get('/urls/:shortURL', (req, res) => {
  let tempVar = {shortURL : req.params.shortURL, longURL : urlDB[req.params.shortURL]}
  res.render('urls_show', tempVar)
})




console.log('Will listen to PORT');
app.listen(PORT, ()=>{
  console.log(`Now I listen PORT" ${PORT}`);
});


// GENERATE STRING
// the string will be generated based on listed characters with a length of 6 charaters
function generateRandomString() {
  let shortUrl = "";
  const length = 6; 
  let randLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
  shortUrl += randLetter.charAt(Math.floor(Math.random() * randLetter.length));
  return shortUrl;
}
