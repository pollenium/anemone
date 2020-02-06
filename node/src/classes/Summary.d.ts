export declare type Jsonable = number | string | JsonableArray | JsonableObject;
interface JsonableArray extends Array<Jsonable> {
}
interface JsonableObject extends Record<string, Jsonable> {
}
export declare abstract class Summary {
    abstract toJsonable(): Jsonable;
}
export {};
