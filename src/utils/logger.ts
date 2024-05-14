import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.path);
    console.log("------------------------");
    next();
};

export default logger