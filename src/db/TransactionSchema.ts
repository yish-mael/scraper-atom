import { Schema, model} from "mongoose";

interface Transaction {
    transactionId: string,
    sender: string,
    beneficiary: string,
    amount: string,
    description?: string,
    type: string,
    dateCleared: string,
    accountType: string,
    bank: string,
    customer: string
}

const transactionSchema = new Schema<Transaction>({
    transactionId: {type: String, required: true},
    sender: {type: String, required: true},
    beneficiary: {type: String, required: true},
    amount: {type: String, required: true},
    description: {type: String, required: false},
    type: {type: String, required: true},
    dateCleared: {type: String, required: true},
    accountType: {type: String, required: true},
    bank: [{type: Schema.Types.ObjectId, ref: 'Bank'}],
    customer: [{type: Schema.Types.ObjectId, ref: 'Customer'}]
});
 
export default model<Transaction>('Transaction', transactionSchema);


