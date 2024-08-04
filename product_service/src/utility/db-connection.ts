import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
    const DB_URL = 
        "mongodb+srv://example:example@cluster0.gaajwxc.mongodb.net/nodejs-sls-mc"

    try {
        await mongoose.connect(DB_URL);
    } catch (err) {
        console.log(err);
    }
};

export { ConnectDB };