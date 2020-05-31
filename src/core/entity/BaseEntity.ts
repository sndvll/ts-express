import 'reflect-metadata';
import { ID } from '../decorators';
import { IEntity } from './EntityFactory';

/**
 * Base entity class. All entities extends this class.
 */
export class BaseEntity implements IEntity {

    @ID
    public id: string;

    public getPersistenceObject(): any {
        const out = {};
        const persistedProps: string[] = Reflect.getMetadata('entity:properties', this);
        const idProp = Reflect.getMetadata('entity:id', this);
        out[idProp] = this[idProp];
        for (const prop of persistedProps) {
            if (this[prop]) {
                out[prop] = this[prop];
            }
        }
        return out;
    }
}
