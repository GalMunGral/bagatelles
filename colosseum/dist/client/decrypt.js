import CryptoJS from "crypto-es";
import { modExp, G, P } from "../common/dh.js";
import { memo } from "../common/memo.js";
import { nodebug } from "./nodebug.js";
const AES_PASS_ENDPOINT = "/colosseum/aes-password";
const DH_KEY_ENDPOINT = "/colosseum/key-exchange";
export const decryptChunk = memo(nodebug(function* (base64) {
    return wordArrayToBuffer(CryptoJS.AES.decrypt(base64, (yield getAESPassword())));
}));
const getAESPassword = memo(nodebug(function* () {
    const DH_KEY = (yield diffieHellmanKeyExchange());
    const encrypted = (yield (yield fetch(AES_PASS_ENDPOINT)).text());
    return CryptoJS.AES.decrypt(encrypted, DH_KEY).toString(CryptoJS.enc.Utf8);
}));
const diffieHellmanKeyExchange = memo(nodebug(function* () {
    const M = BigInt(Math.floor(Math.random() * 0xabcdef));
    const GMP = modExp(G, M, P);
    const GNP = BigInt(yield (yield fetch(`${DH_KEY_ENDPOINT}?gmp=${GMP}`)).text());
    const GMNP = modExp(GNP, M, P);
    return btoa(String(GMNP));
}));
function wordArrayToBuffer(wordArray) {
    return Uint8Array.from(wordArray.words.flatMap((word) => [
        (word & 0xff000000) >> 24,
        (word & 0x00ff0000) >> 16,
        (word & 0x0000ff00) >> 8,
        word & 0x000000ff,
    ])).slice(0, wordArray.sigBytes);
}
