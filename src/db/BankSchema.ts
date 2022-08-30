import { Schema, model} from "mongoose";

interface Bank {
    name: string,
    details?: string
}

const bankSchema = new Schema<Bank>({
    name: {type: String, required: true},
    details: {type: String, required: false}
});

export default model<Bank>('Bank', bankSchema);


