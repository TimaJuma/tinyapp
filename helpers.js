// GENERATE STRING
// the string will be generated based on listed characters with a length of 6 charaters

const generateRandomString = () => Math.random().toString(16).slice(2,8);

//OPT2
// function generateRandomString() {
//   let shortUrl = "";
//   const length = 6; 
//   let randLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < length; i++)
//   shortUrl += randLetter.charAt(Math.floor(Math.random() * randLetter.length));
//   return shortUrl;
// }


//LOOKUP EMAIL in users object/DB
const checkEmail = (email, DB) => {
  for (let user in DB) {
    if (DB[user].email === email) {
      return DB[user].id;
    }
  }
};



// RETURN objects of URLs that are linked to specific user 
const urlsForUsers = (id, urlDB) => {
  const userURLs = {}
  for (user in urlDB) {
    if (urlDB[user]['userID'] === id) userURLs[user] = urlDB[user]
  }
  return userURLs;
} 



module.exports = {
  generateRandomString,
  checkEmail,
  urlsForUsers
}