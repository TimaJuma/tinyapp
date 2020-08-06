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


module.exports = {
  generateRandomString
}