const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;

app.listen(port, () => {
  console.log("listening at " + port);
});
app.use(express.static("p5"));
app.use(express.json({ limit: "8mb" }));

app.post("/saveData", (req, res) => {
  console.log(1);
  //console.log(req.body);
  let file = "./database/" + req.body.fileName + ".json";
  req.body.fileName = undefined;
  fs.writeFileSync(file, JSON.stringify(req.body), (err) => {
    if (err) throw err;
    console.log("FILE WRITTEN");
  });
  res.json({
    status: "Saved Sucessfully to database",
  });
});
