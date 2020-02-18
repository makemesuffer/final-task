const mongoose = require("mongoose");
const UserRepository = require("./repositories/userRepository");
const BaseRepository = require("./repositories/baseRepository");

const user = new UserRepository();
const base = new BaseRepository();

module.exports.setUpConnection = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
};

module.exports.Users = user;
module.exports.Base = base;
