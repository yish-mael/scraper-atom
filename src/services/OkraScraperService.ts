import * as puppeteer from 'puppeteer';
import * as fs from 'fs';


async function okraScraper()
{
    const credentials = {
        email: "iakinnubi@gmail.com",
        password: "secret@123",
        otp: "12345"
    } 
    
    const url = 'https://bankof.okra.ng';

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

    const page = await browser.newPage();

    await page.goto(url);
    
    await page.evaluate(() => document.querySelectorAll('a')[1]?.click());

    await page.type('#email', credentials.email);

    await page.type('#password', credentials.password);

    page.on('dialog', async dialog => await dialog.accept());

    await page.evaluate(() => document.querySelector('button')?.click());
    
    await page.waitForNavigation();
    await page.type('#otp', credentials.otp);
    
    await page.evaluate(() => document.querySelector('button')?.click());
    
    await page.waitForTimeout(4000);
    
    const welcomeString =  await page.evaluate(() => document.querySelectorAll('h1')[1].innerText.split(" "));
    const fullName = welcomeString[2] + " " + welcomeString[3].replace("!", "");
    const address =  await page.evaluate(() => document.querySelectorAll('p')[0].innerText.split(":")[1]);
    const bvn =  await page.evaluate(() => document.querySelectorAll('p')[1].innerText.split(" ")[1]);
    const phone =  await page.evaluate(() => document.querySelectorAll('p')[2].innerText.split(" ")[1]);
    const email =  await page.evaluate(() => document.querySelectorAll('p')[3].innerText.split(" ")[1]);
    
    // create customer object.
    const customer = {
        fullName,
        email,
        phone,
        bvn,
        address
    }

    const savingsBalance =  await page.evaluate(() => document.querySelectorAll('p')[4].innerText);
    const savingsLedgerBalance =  await page.evaluate(() => document.querySelectorAll('p')[5].innerText.split(" (")[0]);
    const marketBalance =  await page.evaluate(() => document.querySelectorAll('p')[6].innerText);
    const marketLedgerBalance =  await page.evaluate(() => document.querySelectorAll('p')[7].innerText.split(" (")[0]);
    
    // create accounts object. 
    const accounts = {
        savingsAccount: {
            balance: savingsBalance,
            ledgerBalance: savingsLedgerBalance
        }, 
        moneyMarketAccount: {
            balance: marketBalance,
            ledgerBalance: marketLedgerBalance
        }
    };
    
    await page.evaluate(() => document.querySelectorAll('a')[3]?.click());

    // create transactions object
    let transactions: any = {}

    async function getTransactions(totalSavingsTransactions: number){
        let totalPages = Math.floor(totalSavingsTransactions/10); 
        const remainder = (totalSavingsTransactions%10);
        if(remainder > 0) totalPages += 1;
        let perPage = 10;
        let totalSavingsCouter = 0;
        let itemsLeft = 0;
        let dataArray = [];
        await page.waitForTimeout(4000);

        for (let i = 0; i < totalPages; i++){
        
            for(let x = 0; x < perPage; x++ ){

                const row  = await page.evaluate(() => {
                    
                    const tableBody =  document.querySelector('tbody')?.innerText.split(/\s\s+/g);

                    const trs = tableBody?.map((tr) => {
                        let item =  tr.split(/\t+/g);
                        return {
                            sender: item[5],
                            beneficiary: item[4],
                            amount: item[3],
                            description: item[2],
                            type: item[0],
                            dateCleared: item[1] 
                        };
                    });
                    return trs;
                });
                dataArray.push(row);
                console.log(row);
                totalSavingsCouter++;
            }
            await page.evaluate(() => document.querySelectorAll('button')[1]?.click());
            await page.waitForTimeout(2000);
            itemsLeft = totalSavingsTransactions - totalSavingsCouter;
            if(itemsLeft < 10) {
                perPage = itemsLeft;
            } 
        }
    }

    // create savings transactions object.
    await getTransactions(827);

    let savingsTArray = await getTransactions(827);

    await page.goBack();
    await page.evaluate(() => document.querySelectorAll('a')[4]?.click());

    // create money market transactions object.
    let moneyMTArray = await getTransactions(891);

    // set transaction objects.
    transactions.savings = savingsTArray;
    transactions.moneyMarket = moneyMTArray;

    // log the three objects created.
    console.log(accounts, customer, transactions);

    
    await page.evaluate(() => document.querySelectorAll('a')[2]?.click());

    await page.close();

    await browser.close()

    let result =  {
        accounts, 
        customer, 
        transactions
    }
    
    const stream = fs.createWriteStream('/storage/data.json');
    stream.write(JSON.stringify(result));
    stream.end();

    return result

}

export default okraScraper;
