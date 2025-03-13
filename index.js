import express from "express"


const app = express()


app.listen(4000 , ()=>{
  console.log("Started")
})

app.get("/", (req, res) => {
  
})