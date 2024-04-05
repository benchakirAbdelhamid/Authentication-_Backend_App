const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "Authentication_App",
      //    useNewUrlParser: true,
      //    useUnifiedTopology: true,
      //    useCreateIndex: true,
      //    useFindAndModify: false,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
