// express is the framework we're going to use to handle requests
const express = require('express');
// bodyParser is needed to parse the body of POST requests in postman, that are encoded in JSON
// postman is a tool we can use to test our API. It acts like a browser, but we can customize the HTTP method, headers, and body
const bodyParser = require('body-parser');
// mongoose is the client we will use to talk to the database
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
// urlencoded is a method in body-parser that lets us parse data from html forms (and postman)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// connect to the database named "wikiDB"
mongoose.connect("mongodb://localhost:27017/wikiDB");
// create a schema for our database having article title and content
const articleSchema = {
    title: String,
    content: String
}
// create a model for our database (a model is like a collection or a table in a relational database)
const Article = mongoose.model("Article", articleSchema);
/*
app.get("/articles", function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            // console.log(foundArticles);
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});
app.post("/articles", function(req, res){
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
});

app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});
*/

// Building a RESTful API with Express and MongoDB
// 1- Requests targeting all articles
// using chained route handlers to handle requests
app.route("/articles")
    // GET all articles from the database
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            // console.log(foundArticles);
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
    // POST a new article to the database
.post(function(req, res){
    // console.log(req.body.title);
    // console.log(req.body.content);
    // create a new article using the Article model
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    // save the new article to the database
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})
    // DELETE all articles from the database
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});
// :articleTitle is a placeholder for the title of the article
// :articleTitle acts like a variable, it can be accessed by req.params.articleTitle
// 2- Requests targeting a specific article
app.route("/articles/:articleTitle")
    // GET a specific article from the database
    .get((req, res)=>{
        // Reading from database using findOne() method with a condition on the title
        // if the title of the article is the same as the title in the request, then return the article
        // remember that req.params.articleTitle is the title of the article in the url (the placeholder)
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
}).put((req, res)=>{
    // put method replaces the entire document with the new document just to update it
    // if a field is not provided, it will be set to null
    Article.updateOne({title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        (err)=>{
            if(!err){
                res.send("Successfully updated article.");
            }
        });
    // patch is used to update only a specific part of the article and it doesn't replace the whole article
}).patch((req, res)=> {
    Article.updateOne({title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        });
}).delete((req, res)=>{
    Article.deleteOne({title: req.params.articleTitle}, (err)=>{
        if(!err){
            res.send("Successfully deleted the corresponding article.");
        } else {
            res.send(err);
        }
    });
});

// url encoding: space is replaced by %20
// url encoding: ? is replaced by %3F
// url encoding: & is replaced by %26
// url encoding: = is replaced by %3D
// url encoding: + is replaced by %2B

// app.route("/articles").get().post().delete();
app.listen(3000, function() {
    console.log("Server started on port 3000");
});


