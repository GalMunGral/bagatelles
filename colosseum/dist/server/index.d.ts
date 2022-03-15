import { NextFunction, Request, Response } from "express";
export declare function colosseum(AES_PASSWORD: string): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
