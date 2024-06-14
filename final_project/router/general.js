const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(1)
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Insufficient Data"});
});

const fetchbooks = async()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(books)
    },1000)
  })
}
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const books = await fetchbooks(); // Wait for the books to be fetched
    return res.send({ books: books }); 
} catch (error) {
    return res.status(500).send({ error: 'Failed to fetch books' });
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn = req.params.isbn
  try {
    const books = await fetchbooks(); // Wait for the books to be fetched
    return res.send(books[isbn]); 
} catch (error) {
    return res.status(500).send({ error: 'Failed to fetch books' });
}
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author
  let ans = []
  try {
    const books = await fetchbooks(); // Wait for the books to be fetched
    let book={}
  for (let b in books){
    if (books[b].author == author){
        book.ISBN = b
        book.title = books[b].title
        book.reviews = books[b].reviews
        ans.push(book)
        book={}
    }
  }
  console.log(ans)
  return res.send({"booksByAuthor" : ans});; 
} catch (error) {
    return res.status(500).send({ error: 'Failed to fetch books' });
}
  
});

// Get all books based on title
public_users.get('/title/',async function (req, res) {
  let title = req.query.title
  console.log(title)
  let ans = []
  try {
    const books = await fetchbooks(); // Wait for the books to be fetched
    let book={}
  for (let b in books){
    if (books[b].title == title){
        book.ISBN = b
        book.author = books[b].author
        book.reviews = books[b].reviews
        ans.push(book)
        book={}
    }
  }
  console.log(ans)
  return res.send({"booksByTitle" : ans});
} catch (error) {
    return res.status(500).send({ error: 'Failed to fetch books' });
}
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let review = books[isbn].reviews
  return res.status(300).send(review);
});

module.exports.general = public_users;
