import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import Quote from './quote.json' with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("Public"));
app.set('view engine', 'ejs');
function appendDataToFile(req, res) {
    const postCount = Object.keys(Quote.blogs).length;

    // Generate the key for the new post
    const newPostKey = `post${postCount + 1}`;
    // Extract the new data to be appended from req.body
    const newData = {
        blogs: {
            [newPostKey]: {
                quoteHead: req.body["head"],
                quoteDescription: req.body["desc"],
                author: req.body["author"]
            }
        }
    };
    // Specify the file path
    const filePath = './quote.json';

    // Read existing data from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Error reading file' });
            return;
        }

        let jsonData;
        try {
            // Parse existing JSON data
            jsonData = JSON.parse(data);
            console.log('Parsed JSON data:', jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: 'Error parsing JSON' });
            return;
        }

        // Merge new data with existing data
        const mergedData = {
            ...jsonData,
            blogs: {
                ...jsonData.blogs,
                ...newData.blogs
            }
        };

        // Convert the merged data to JSON format
        const mergedJsonData = JSON.stringify(mergedData, null, 2);

        // Write the merged JSON data back to the file
        fs.writeFile(filePath, mergedJsonData, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
                res.status(500).json({ error: 'Error writing to file' });
            } else {
                console.log('Data has been appended to the file successfully.');
                res.redirect("/");
            }
        });
    });
}






app.get("/",(req,res)=>{
    res.render("index.ejs", Quote);
});
app.get("/create",(req,res)=>{
    res.render("createPost.ejs");
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.post("/submit", (req, res) => {
    appendDataToFile(req, res);
});
app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});