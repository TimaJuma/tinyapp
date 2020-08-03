const express = require('express');
const app = express();
const PORT = 4040;

app.set('view engine', 'ejs');

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


app.get('/urls/:shortURL', (req, res) => {
  let tempVar = {shortURL : req.params.shortURL, longURL : urlDB[req.params.shortURL]}
  res.render('urls_show', tempVar)
})

// app.get('/hello', (req, res)=> {
//   res.send('<h1>Hello There!</h1>\n')
// });


// app.get("/set", (req, res) => {
//   const a = 10;
//   res.send(`a = ${a}`);
// });

// app.get('/fetch', (req, res) => {
//   res.send(`a = ${a}`);
// });



console.log('Will listen to PORT');
app.listen(PORT, ()=>{
  console.log(`Now I listen PORT" ${PORT}`);
})

