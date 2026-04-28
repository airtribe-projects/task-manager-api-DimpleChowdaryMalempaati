require("dotenv").config();

const app = require("./src/app");

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened", err);
    process.exitCode = 1;
    return;
  }
  console.log(`Server is listening on ${port}`);
});
