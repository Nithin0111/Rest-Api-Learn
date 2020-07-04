//jshint esversion:6

//requiring packages
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect('mongodb://localhost:27017/apiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title : String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

// Requests targeting all articles
app.route('/articles') //Express chained routing

.get((req,res)=>{
    const dbData = Article.find((err,foundArticles)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundArticles);
        }
    });
})

.post((req,res)=>{
    const insertArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    insertArticle.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send("Successfully inserted");
        }
    });
})

.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send('Deleted Successfully');
        }
    });
});


//Requests targeting specific article

app.route("/articles/:articleName")

.get((req,res)=>{
    Article.findOne({title : req.params.articleName},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send('No article matched');
        }
    });
})

.put((req,res)=>{
    Article.update(
        {title : req.params.articleName},
        {title : req.body.title, content : req.body.content},
        {overwrite:true},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send('Successfully updated the article');
            }
        });
})

.patch((req,res)=>{
    Article.update(
        {title : req.params.articleName},
        {$set : req.body},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send('Successfully patched the article');
            }
        });
})

.delete((req,res)=>{
    Article.deleteOne({title : req.params.articleName},(err)=>{
        if(err){
            res.send(err);
        }else{
            res.send('Successfully deleted single article');
        }
    });
});



const port = 3000;
app.listen(port,()=>{
    console.log("Server started on http://localhost:" + port);
});