let express = require("express");
let app = express();
let PORT = process.env.PORT || 3000;
let path = require("path");
let mongoose = require("mongoose");
let Post = require("./models/postModel");
let methodOverride = require("method-override");

let db = "mongodb+srv://linatys024:Rk&4rtlm@cluster0.y2fkm.mongodb.net/Node-blog";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));



// Головна сторінка
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Форма додавання посту
app.get("/add-post", (req, res) => {
    res.render("add-post", { title: "Add Post" });
});

// Обробка додавання посту
app.post("/add-post", (req, res) => {
    let { title, author, content } = req.body;
    let post = new Post({ title, author, content });
    post
        .save()
        .then(() => res.redirect("/posts"))
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});

// Відображення списку постів
app.get("/posts", (req, res) => {
    Post.find()
        .then((posts) =>
            res.render("posts", {
                title: "Posts",
                posts,
            })
        )
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});

// Форма редагування посту
app.get("/edit-post/:id", (req, res) => {
    let id = req.params.id;
    Post.findById(id)
        .then((post) =>
            res.render("edit-post", {
                title: `Edit Post: ${post.title}`,
                post,
            })
        )
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});

// Обробка редагування посту
app.put("/edit-post/:id", (req, res) => {
    let id = req.params.id;
    const { title, author, content } = req.body;
    Post.findByIdAndUpdate(id, { title, author, content })
        .then(() => res.redirect("/posts"))
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});

// Видалення посту
app.delete("/posts/:id", (req, res) => {
    let id = req.params.id;
    Post.findByIdAndDelete(id)
        .then(() => res.redirect("/posts"))
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});



// Запуск сервера
async function start() {
    try {
        await mongoose.connect(db);
        console.log("Connection to MongoDB is successful!");
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}...`);
        });
    } catch (error) {
        console.log("\nConnection error!!!\n\n", error);
    }
}

start();
