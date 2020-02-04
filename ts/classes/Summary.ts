export type Jsonable = number | string | JsonableArray | JsonableObject
interface JsonableArray extends Array<Jsonable> {}
interface JsonableObject extends Record<string, Jsonable> {}

export abstract class Summary {

  abstract toJsonable(): Jsonable

}
