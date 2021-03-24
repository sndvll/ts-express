import 'reflect-metadata';
import { ID } from '../decorators';
import { IEntity } from './EntityFactory';

/**
 * Base entity class. All entities extends this class.
 * Ignoring out some ts-stuff here due to complex typing.
 */
export class BaseEntity implements IEntity {

    @ID
    public id!: string;

    public getPersistenceObject(): any {
        const out: any = {};
        const persistedProps: string[] = Reflect.getMetadata('entity:properties', this);
        const idProp: string = Reflect.getMetadata('entity:id', this);
        // @ts-ignore
        out[idProp] = this[idProp];
        for (const prop of persistedProps) {
            // @ts-ignore
            if (this[prop]) {
                // @ts-ignore
                out[prop] = this[prop];
            }
        }
        return out; //eslint-disable-line
    }
}
