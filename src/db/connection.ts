import { connect } from "mongoose";
import "dotenv/config";

const DB_PASS = (process.env.PASS as string);

export default async function db() {
    try {
        await connect('mongodb+srv://okra_takehome:'+DB_PASS+'@okra-takehome.nopar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
        console.log('Connected to Okra MongoDB')
    } catch(err) {
        console.error(err);
    }
}