import * as crypto from 'crypto'
import * as Bn from 'bn.js'

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

  slice(...args): Bytes {
    return new Bytes(this.uint8Array.slice(...args))
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

  getBuffer() {
    return Buffer.from(this.uint8Array)
  }

  getPaddedLeft(length: number) {
    if (this.getLength() > length) {
      throw new Error(`Cannot pad, bytes.length (${this.getLength()}) > length (${length})`)
    }
    const uint8Array = (new Uint8Array(length)).fill(0)
    uint8Array.set(this.uint8Array, length - this.getLength())
    return new Bytes(uint8Array)
  }

  prependByte(byte: number) {
    const uint8Array = new Uint8Array(this.uint8Array.length + 1)
    uint8Array[0] = byte
    uint8Array.set(this.uint8Array, 1)
    return new Bytes(uint8Array)
  }

  append(bytes: Bytes) {
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

  compare(bytes: Bytes): number {
    return this.getBuffer().compare(bytes.getBuffer())
  }

  static fromUtf8(utf8: string): Bytes {
    return Bytes.fromBuffer(Buffer.from(utf8, 'utf8'))
  }

  static fromBuffer(buffer: Buffer): Bytes {
    return new Bytes(new Uint8Array(buffer))
  }

  static fromHex(hex: string) {
    return Bytes.fromBuffer(Buffer.from(hex, 'hex'))
  }

  static fromBn(bn: Bn) {
    return Bytes.fromHex(bn.toString(16))
  }

  static fromNumber(number: number) {
    return Bytes.fromBn(new Bn(number))
  }

  static random(length: number) {
    return Bytes.fromBuffer(crypto.randomBytes(length))
  }
}
