import * as ls from 'localStorage'
import { Bytes } from './Bytes'

export enum DB_KEY_BLINK {
  ZX_ORDERS = 0
}

export function getKey(keyBlink: DB_KEY_BLINK, keyBody: Bytes): Bytes {
  return keyBody.prependByte(keyBlink).getHash()
}

export class Db {
  get(keyBlink: DB_KEY_BLINK, keyBody:Bytes): null | Bytes {
    const valueString = localStorage.getItem(getKey(keyBlink, keyBody).getHex())
    if (valueString.length === 0) {
      return null
    }
  }
  set(keyBlink: DB_KEY_BLINK, keyBody:Bytes, value: Bytes) {
    ls.setItem(getKey(keyBlink, keyBody).getHex(), value.getHex())
  }
}
