import { HELP } from './Words/HELP';
import { HELLO } from './Words/HELLO';
import { WATER } from './Words/WATER';
import { DOCTOR } from './Words/DOCTOR';
import { YES } from './Words/YES';
import { NO } from './Words/NO';
import { THANK } from './Words/THANK';
import { SORRY } from './Words/SORRY';
import { FOOD } from './Words/FOOD';
import { STOP } from './Words/STOP';
import { GOOD } from './Words/GOOD';
import { BAD } from './Words/BAD';
import { MORE } from './Words/MORE';
import { PLEASE } from './Words/PLEASE';
import { BATHROOM } from './Words/BATHROOM';
import { PAIN } from './Words/PAIN';

const WORD_MAP = {
    "HELP": HELP,
    "HELLO": HELLO,
    "WATER": WATER,
    "DOCTOR": DOCTOR,
    "YES": YES,
    "NO": NO,
    "THANK": THANK,
    "SORRY": SORRY,
    "FOOD": FOOD,
    "STOP": STOP,
    "GOOD": GOOD,
    "BAD": BAD,
    "MORE": MORE,
    "PLEASE": PLEASE,
    "BATHROOM": BATHROOM,
    "PAIN": PAIN
};

export const wordList = Object.keys(WORD_MAP);

export function playSequence(words, ref) {
    const validWords = words.map(w => w.toUpperCase()).filter(w => WORD_MAP[w]);
    validWords.forEach((word) => {
        WORD_MAP[word](ref);
    });
}

export default WORD_MAP;

export {
    HELP, HELLO, WATER, DOCTOR, YES, NO, THANK, SORRY,
    FOOD, STOP, GOOD, BAD, MORE, PLEASE, BATHROOM, PAIN
};
