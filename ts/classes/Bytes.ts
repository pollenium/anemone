import * as crypto from 'crypto'
import Bn from 'bn.js'

export class Bytes {
  constructor(public uint8Array: Uint8Array) {}

  getLength(): number {
    return this.uint8Array.length
  }

  equals(bytes: Bytes): boolean {
    if (this.uint8Array.length !== bytes.uint8Array.length) {
      return false
    }
    for (let i = 0; i < this.uint8Array.length; i++) {
      if (this.uint8Array[i] !== bytes.uint8Array[i]) {
        return false
      }
    }
    return true
  }

  slice(start: number, end: number): Bytes {
    return new Bytes(this.uint8Array.slice(start, end))
  }

  getHash(): Bytes {
    return Bytes.fromBuffer(crypto.createHash('sha256').update(this.uint8Array).digest())
  }

  getHex(): string {
    return this.getBuffer().toString('hex')
  }

  getPhex(): string {
    return `0x${this.getHex()}`
  }

  getUtf8(): string {
    return this.getBuffer().toString('utf8')
  }

  getBuffer(): Buffer {
    return Buffer.from(this.uint8Array)
  }

  getPaddedLeft(length: number): Bytes {
    if (this.getLength() > length) {
      throw new Error(`Cannot pad, bytes.length (${this.getLength()}) > length (${length})`)
    }
    const uint8Array = (new Uint8Array(length)).fill(0)
    uint8Array.set(this.uint8Array, length - this.getLength())
    return new Bytes(uint8Array)
  }

  prependByte(byte: number): Bytes {
    const uint8Array = new Uint8Array(this.uint8Array.length + 1)
    uint8Array[0] = byte
    uint8Array.set(this.uint8Array, 1)
    return new Bytes(uint8Array)
  }

  append(bytes: Bytes): Bytes {
    const uint8Array = new Uint8Array(this.getLength() + bytes.getLength())
    uint8Array.set(this.uint8Array)
    uint8Array.set(bytes.uint8Array, this.getLength())
    return new Bytes(uint8Array)
  }

  getBn(): Bn {
    return new Bn(this.getHex(), 16)
  }

  getNumber(): number {
    return this.getBn().toNumber()
  }

  getXor(bytes: Bytes): Bytes {
    if (this.getLength() !== bytes.getLength()) {
      throw new Error('Cannot xor, length mismatch')
    }

    const xorUint8Array = new Uint8Array(bytes.getLength())

    for (let i = 0; i < bytes.getLength(); i++) {
      // eslint-disable-next-line no-bitwise
      xorUint8Array[i] = this.uint8Array[i] ^ bytes.uint8Array[i]
    }

    return new Bytes(xorUint8Array)
  }

  compare(bytes: Bytes): number {
    return this.getBuffer().compare(bytes.getBuffer())
  }

  static fromUtf8(utf8: string): Bytes {
    return Bytes.fromBuffer(Buffer.from(utf8, 'utf8'))
  }

  static fromBuffer(buffer: Buffer): Bytes {
    return new Bytes(new Uint8Array(buffer))
  }

  static fromHex(hex: string): Bytes {
    return Bytes.fromBuffer(Buffer.from(hex, 'hex'))
  }

  static fromBn(bn: Bn): Bytes {
    return Bytes.fromHex(bn.toString(16))
  }

  static fromNumber(number: number): Bytes {
    return Bytes.fromBn(new Bn(number))
  }

  static random(length: number): Bytes {
    return Bytes.fromBuffer(crypto.randomBytes(length))
  }
}
