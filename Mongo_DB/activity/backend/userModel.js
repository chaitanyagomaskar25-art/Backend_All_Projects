import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username:{
    type:String,
    required:true
  },

  bio:{
    type: String
  },

  followers:{
    type:Number
  },

  following:{
    type:Number
  },

  hobbies:{
    type:[String]
  },
  links: {
    type:[String]

  }


})

const User = mongoose.model("User", userSchema)


export default User
