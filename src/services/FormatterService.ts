import bankSchema from "../db/BankSchema";
import customerSchema from "../db/CustomerSchema";
import transactionSchema from "../db/TransactionSchema";

interface Data {
    bankName: string,
    bankDetails?: string, 
    customer: {
        fullName: string,
        email: string,
        password: string,
        address?: string,
        phone?: string,
        bvn: string,
    },
    transactions: [
        {
            transactionId: string,
            sender: string,
            beneficiary: string,
            amount: string,
            description?: string,
            type: string,
            dateCleared: string,
            accountType: string,
        }
    ]
}


async function formatter(data: Data )
{
    try{
    const bank = {
        name: data.bankName, 
        details: data.bankDetails, 
    }

    const nameCheck = await bankSchema.findOne({ name: bank.name });
    let bankId: any = nameCheck?._id;

    let createBank: any = {}
    if (nameCheck === null) {
        createBank = await bankSchema.create(bank);
        bankId = createBank?._id;
    }

    const customer = {
        fullName: data.customer.fullName, 
        email: data.customer.email, 
        password: data.customer.password, 
        address: data.customer.address, 
        phone: data.customer.phone, 
        bvn: data.customer.bvn,
        bank: bankId 
    }

    const emailCheck = await customerSchema.findOne({ email: customer.email });
    let customerId: any = emailCheck?._id;
    
    let createCustomer: any = {}
    if (emailCheck === null) {
        createCustomer = await customerSchema.create(customer);
        customerId = createCustomer?._id;
    }

    let transactionsx = [];
    for (let i = 0;  i < data.transactions.length; i++) {

        const item =  {
            transactionId: data.transactions[i].transactionId,
            sender: data.transactions[i].sender,
            beneficiary: data.transactions[i].beneficiary,
            amount: data.transactions[i].amount,
            description: data.transactions[i].description,
            type: data.transactions[i].type,
            dateCleared: data.transactions[i].dateCleared,
            accountType: data.transactions[i].accountType,
            bank: bankId,
            customer: customerId
        };

        let transactionCheck = await transactionSchema.findOne({ transactionId: item.transactionId });
        let tId = transactionCheck?._id;
        let createTransaction: any = {};
        if (transactionCheck === null) {
            createTransaction = await transactionSchema.create(item);
            transactionsx.push(createTransaction);
            tId = createCustomer?._id;
        }
        transactionsx.push(transactionCheck);
    }
    
    return { bank: nameCheck||createBank, customer: emailCheck||createCustomer, transactions: transactionsx };
    }catch(e){
        throw e;
    }
}

export default formatter;
