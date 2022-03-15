import { NextFunction, Request, Response } from "express";
import CryptoJS from "crypto-es";
import { modExp, G, P } from "../common/dh.js";

const COOKIE_KEY = "COLOSSEUM_CLIENT_ID";

export function colosseum(AES_PASSWORD: string) {
  const clientIdToKey = new Map();
  let nextClientId = 0;

  return function (req: Request, res: Response, next: NextFunction) {
    if (/^\/colosseum\/key-exchange\/?$/.test(req.path)) {
      const clientId = nextClientId++;
      const N = BigInt(Math.floor(Math.random() * 0xabcdef));
      const GNP = modExp(G, N, P);
      const GMP = BigInt(String(req.query["gmp"]));
      const GMNP = modExp(GMP, N, P);
      clientIdToKey.set(clientId, btoa(String(GMNP)));
      return res.cookie(COOKIE_KEY, clientId).end(String(GNP));
    }

    if (/^\/colosseum\/aes-password\/?$/.test(req.url)) {
      const clientId = +req.cookies[COOKIE_KEY];
      const DH_KEY = clientIdToKey.get(clientId);
      const encrypted = CryptoJS.AES.encrypt(AES_PASSWORD, DH_KEY).toString();
      return res.send(encrypted);
    }

    next();
  };
}
