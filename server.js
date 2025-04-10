const mongoose = require("mongoose");
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
  })
  .then(() => console.log("DB connection successful"));

  const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  });

  const Tour = mongoose.model("Tour", tourSchema);

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
