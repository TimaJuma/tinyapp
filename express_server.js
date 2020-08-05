// toDO:
// 1. Move helpers function to seperate file
// 2. clean code from console.logs
// 3. reorganize routers
// 4. login form in / route



//=====================================================================================

// IMPORT ALL MODULES
const express = require('express');

const PORT = 4040 || process.env.PORT;
const cookieParser = require('cookie-parser'); 
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const { fileLoader } = require('ejs')

// run express Class and wrap it in app instance
const app = express();

// tune middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.use(cookieSession( {
  name: 'session',
  keys: ['masya']
}));

app.set('view engine', 'ejs');


//======================================================================================

// users storage Object
const users = {
  'aaaaaa': {
    id: "aaaaaa",
    email: 'tima.xpl@gmail.com',
    password: 'pass'
  }
}



// ur storage Object
const urlDB = {
  "xxc2y" : "https://www.lighthouselabs.ca",
  "9m5xk" : "https://www.google.com"
};


//======================================================================================


// MAIN FUNCTIONALITY


// MAIN PAGE
app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDB);
});

app.get('/urls', (req, res) => {
  const username = req.cookies.name
  console.log(username)
  let tempVar = {
    urls: urlDB, 
    username: req.cookies.name};
  res.render('urls_index', tempVar)
})


// new URL with submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


//on form submit via POST
app.post('/urls', (req, res) => {
  //get longURL from from submitted form and generate shortURL
  const longURL= req.body.longURL;
  const shortURL = generateRandomString()
  
  //update URLDB object, where all URLs are stored
  urlDB[shortURL] = longURL;
  //console.log(req.body.longURL);
  //console.log(urlDB);
  // res.send('Ok');
  //redirect to the newly generated shortURL
  //res.redirect(`/urls/${shortURL}`);
  res.redirect('/urls');
})


// dynamic URL form URL DB/object
app.get('/urls/:shortURL', (req, res) => {
  let tempVar = {shortURL : req.params.shortURL, longURL : urlDB[req.params.shortURL]}
  res.render('urls_show', tempVar)
})


// when short URL requested, redirect user to actual long URL/site
app.get("/u/:shortURL", (req,res) => {
  const longURL = urlDB[req.params.shortURL]
  console.log(longURL);
  res.redirect(longURL);
})



// handle POST request to UPDATE longURL by redirecting to dedicated URL info page
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id
  const longURL = req.body.longURL
  console.log('longB', longURL)
  urlDB[shortURL] = longURL;
  res.redirect(`/urls`);
})



// DELETE url from the list stored i object
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURLtoDel = req.params.shortURL;
  delete urlDB[shortURLtoDel];
  res.redirect('/urls')
})


// USER REGISTRATION AND LOGIN ======================================================
  // store username in cookies
app.post('/login', (req,res) => {
  const username = req.body.username
  res.cookie('name', username);
  res.redirect('/urls')
})

// logout and clear username cookie
app.post('/logout', (req, res) => {
  res.clearCookie('name')
  res.redirect('/urls');
})


//REGISTER USER
app.get('/register', (req, res) => {
  res.render('register');
})


app.post('/register', (req,res) => {
  //   console.log('response to POST register', req.body)
  // generate userID and store other parameters in userIds value
  const userID = generateRandomString();
  console.log('Cookie session:', req.session.name)
  // check if user has pased values to form input fields 
 console.log('---------------')

  const newUser = req.body;
  if (newUser.email && newUser.password && newUser.password_confirm && newUser.password === newUser.password_confirm) {
    res.cookie('name', userID);
    users[userID] = {
      id: userID,
      email: newUser.email,
      password: newUser.password
    }
  } else {
    res.render('register');
  }

  //   console.log(users);
  res.redirect('/urls');
})




//Inform user that the server is on and listens at particular port
console.log('Will listen to PORT');
app.listen(PORT, ()=>{
  console.log(`Now I listen PORT" ${PORT}`);
});


//========== HELPER FUNCTIONS========================== (move to seperate file)

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


//LOOKUP EMAIL in users object/DB
const checkEmail = (email => {
  for (let user in user) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
})
