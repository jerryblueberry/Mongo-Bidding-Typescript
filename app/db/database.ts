import mongoose from "mongoose";
// later add it on env
const CONNECTION =
  "mongodb+srv://sajan2121089:sajank1818@cluster0.cbjbs9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDb = async () => {
  try {
    await mongoose.connect(CONNECTION);

    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Error", error);
  }
};
