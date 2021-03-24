import 'reflect-metadata';

export type EntityTypeInstance<T> = new (...args: any[]) => T;

export interface IEntity {
    _id?: string;
    getPersistenceObject(): any;
}

/**
 * Entity factory class for entity input in routes.
 */
export class EntityFactory {
    public static fromPersistenceObject<T extends IEntity>(obj: any, type: EntityTypeInstance<T>): any { //eslint-disable-line
        const out: any = new type();
        const persistedProps: string[] = Reflect.getMetadata('entity:properties', out) || [];
        const idProp = Reflect.getMetadata('entity:id', out);
        const props = Object.keys(obj);
        for (const prop of props) {
            if (persistedProps.includes(prop) || prop === idProp) {
                out[prop] = obj[prop];
            } else {
                throw new Error(`Property ${prop} not defined in ${type.toString()}`);
            }
        }
        return out; //eslint-disable-line
    }
}
