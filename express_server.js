// IMPORT ALL MODULES
const express = require('express');

const PORT =  process.env.PORT || 4040;
const { fileLoader } = require('ejs')
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const methodOverride = require('method-override'); 


// run express Class and wrap it in app instance
const app = express();

// tune middlewares
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {
  extended: true
}));
app.use(cookieSession( {
  name: 'session',
  keys: ['masya']
}));
app.use(methodOverride('_method'));



//======================================================================================

//SET INITIAL DB/STORAGES

// Object DB to store users, their login details
const users = {
  'aaaaaa': {
    id: "aaaaaa",
    email: 'tima.xpl@gmail.com',
    password: 'pass'
  }
}


// Object DB to store URLs and creator/user of URLs
const urlDB = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};



//======================================================================================


// MAIN FUNCTIONALITY


// MAIN PAGE
app.get("/", (req, res) => {
  if (req.session.name) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDB);
});


// the page MAIN PAGE
app.get('/urls', (req, res) => {
  const name = req.session.name;
  const user = users[name];
  if (user) {
    let tempVar = {urls: urlsForUsers(name), name:user} //
    res.render('urls_index', tempVar)
  } else {
    res.redirect('/login');
  }
})


// render new URL with submission form
app.get("/urls/new", (req, res) => {
  if(!req.session.name){
    res.redirect('/login');
  } else {
    const name = req.session.name
    let templateVars = { urls: urlDB, name: users[name] };
    res.render("urls_new", templateVars);
  }
  
});



//new URL on form submission via POST
app.post('/urls', (req, res) => {
  //get longURL from from submitted form and generate shortURL
  const longURL= req.body.longURL;
  const shortURL = generateRandomString()
  
  //update URLDB object, where all URLs are stored
  urlDB[shortURL] = {
    ['longURL'] : longURL,
    ['userID'] : req.session.name
  }
  //console.log(req.body.longURL);
  //console.log(urlDB);
  //redirect to the newly generated shortURL
  //res.redirect(`/urls/${shortURL}`);
  res.redirect(`/urls/${shortURL}`);
})


// dynamic URL form URL DB/object
app.get('/urls/:shortURL', (req, res) => {
  const name = req.session.name
  let tempVar = {shortURL : req.params.shortURL, longURL : urlDB[req.params.shortURL], name: users[name] }
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
  urlDB[shortURL].longURL = longURL;
  res.redirect(`/`);
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
    name: req.session.name};
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

  } else if(! bcrypt.compareSync(password, (users[checkEmail(email)].password))) {
    res.status(403).send("Wrong Password");
    return;

    // when the user input meets the requirments
  } else {
      req.session.name = checkEmail(email);
    
      //   console.log(users);
      res.redirect('/urls');
    }
  res.redirect('/urls')
})

// logout and clear username cookie
app.post('/logout', (req, res) => {
  req.session = null;
  console.log('logout users', users)
  res.redirect('/login');
})


//REGISTER USER
app.get('/register', (req, res) => {
  let tempVar = {
    name: req.session.name};
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
    const hash =  bcrypt.hashSync(password, salt);
    users[userID] = {
      id: userID,
      email: email,
      password: hash};
      //update usernam in cookies
      req.session.name = userID;
    
      console.log(users);
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


// RETURN objects of URLs that are linked to specific user 
const urlsForUsers = (id) => {
  const userURLs = {}
  for (user in urlDB) {
    if (urlDB[user]['userID'] === id) userURLs[user] = urlDB[user]
  }
  return userURLs;
} 
