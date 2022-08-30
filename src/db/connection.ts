import { connect } from "mongoose";

export default async function db() {
    try {
        await connect('mongodb+srv://okra_takehome:bHrZclVaxWkjwdM7@okra-takehome.nopar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
        console.log('Connected to Okra MongoDB')
    } catch(err) {
        console.error(err);
    }
}