const express =require("express");
const dbConnect = require("./config/db")
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

let PORT=8000;
const app =express();
app.use(express.json());




app.get("/",(req,res)=>{
    res.send("homePage")
})



app.listen(PORT, async () => {
    try {
      await dbConnect();
      console.log("MongoDB connected successfully");
      console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      console.error(`Server failed to start on port ${PORT}`);
    }
  });
  