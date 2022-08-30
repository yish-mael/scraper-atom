import { Request, Response } from "express";
import okraScraper from "../services/OkraScraperService";

class BankController {

    _constructor() {}
 
    static async runScraper(req: Request, res: Response) {  

        try {
            const scrapedData = await okraScraper();
            return res.status(200).json(scrapedData);
        } catch(err) {
            return res.status(500).json({ error: err });
        }
    }
}

export default BankController;