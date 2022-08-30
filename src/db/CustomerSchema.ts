import { Schema, model} from "mongoose";

interface Customer {
    fullName: string,
    email: string,
    password: string,
    address?: string,
    phone?: string,
    bvn: string,
    bank: string
}

const customerSchema = new Schema<Customer>({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: false},
    phone: {type: String, required: false},
    bvn: {type: String, required: true},
    bank: [{type: Schema.Types.ObjectId, ref: 'Bank'}]
});
 
export default model<Customer>('Customer', customerSchema);


