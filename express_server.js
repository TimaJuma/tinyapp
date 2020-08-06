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
  const name = req.cookies.name
  console.log(name)
  let tempVar = {
    urls: urlDB, 
    name: req.cookies.name};
  res.render('urls_index', tempVar)
})


// new URL with submission form
app.get("/urls/new", (req, res) => {
  let tempVar = {
    name: req.cookies.name};
  res.render("urls_new", tempVar);
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
  let tempVar = {shortURL : req.params.shortURL, longURL : urlDB[req.params.shortURL], name: req.cookies.name}
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
app.get('/login', (req, res) => {
  let tempVar = {
    name: req.cookies.name};
  res.render('urls_login', tempVar)
})



  // store username in cookies
app.post('/login', (req,res) => {
  const {email, password} = req.body

  //check what has been passed from client side on FORM submit via POST method
  if (email === "" || password === "") {
    res.status(403).send("Please fill all the fields");
    return;
  } else if(!checkEmail(email)) {
    res.status(403).send("Wrong Email");
    return;

  } else if(users[checkEmail(email)].password !== password) {
    res.status(403).send("Wrong Password");
    return;

    // when the user input meets the requirments
  } else {
      res.cookie('name', checkEmail(email));
    
      //   console.log(users);
      res.redirect('/urls');
    }


 // COMMENT TO DELETE
  res.cookie('name', username);
  res.redirect('/urls')
})

// logout and clear username cookie
app.post('/logout', (req, res) => {
  res.clearCookie('name')
  res.redirect('/login');
})


//REGISTER USER
app.get('/register', (req, res) => {
  let tempVar = {
    name: req.cookies.name};
  res.render('register', tempVar);
})


app.post('/register', (req,res) => {
  // check if user has passed values to forms input fields 
  const {email, password, password_confirm} = req.body

  //check what has been passed from client side on FORM submit via POST method
  if (email === "" || password === "" || password_confirm === "") {
    res.status(400).send("Please fill all the fields");
    return;
  } else if (password !== password_confirm) {
    res.status(400).send("Your password does not match!");
    return;
  } else if(checkEmail(email)) {
    res.status(400).send("This email is already in use");
    return;

    // when the user input meets the requirments
  } else {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: email,
      password: password}
      //update usernam in cookies
      res.cookie('name', userID);
    
      //   console.log(users);
      res.redirect('/urls');
    }
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
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
})
