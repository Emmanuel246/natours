const mongoose  = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
// connecting to mmongodb atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    readPreference: 'primary', 
  })
  .then(() => console.log("DB connection successful"));

  // connecting to mmongodb commpass
  // mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   useUnifiedTopology: true,
  // })
  // .then(() => console.log("DB connection successful"));
// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}......`);
});
