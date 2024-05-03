import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import db from "./db-connect.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("Public"));
app.set('view engine', 'ejs');

db.connect();
function fetchPosts() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM blog_info";
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error executing query", err.stack);
                reject(err);
            } else {
                const posts = result.rows;
                resolve(posts);
            }
        });
    });
}

function addNewPost(req,res) {
    let head = req.body.head;
    let description = req.body.desc;
    let author = req.body.author;
    let updateQuery = `Insert into blog_info(head, description, author) values('${head}', '${description}', '${author}')`;
    db.query(updateQuery,(err,res)=>{
        if(err){
            console.error("Error executing query",err.stack);
        }
        else{
            console.log("Succesfully inserted data");
        }
    });
    res.redirect("/");
}

app.get("/", async (req, res) => {
    try {
        const posts = await fetchPosts();
        res.render("index.ejs", { post: posts });
    } catch (err) {
        res.status(500).send("Error fetching posts from database");
    }
});

app.get("/create",(req,res)=>{
    res.render("createPost.ejs");
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.post("/submit", (req, res) => {
    addNewPost(req, res);
});
app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});