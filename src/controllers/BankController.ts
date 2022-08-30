import { Request, Response } from "express";
import formatter from "../services/FormatterService";
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

    static async runFormatter(req: Request, res: Response) {  

        try {
            const formattedData = await formatter(req.body);
            return res.status(200).json(formattedData);
        } catch(err) {
            return res.status(500).json({ error: err });
        }
        
    }

}

export default BankController;