import 'reflect-metadata';

/**
 * Decorator that adds meta data that indicates that a class is a entity.
 * @param name              the entity name.
 */
const entity = (name: string) => {
    return (constructor: any): void => { //eslint-disable-line
        Reflect.defineMetadata('entity:name', name, constructor);
    }
}

/**
 * Decorator that indicates that a entity property should be persisted.
 * @param entity            the entity
 * @param entityProperty    the entity property.
 */
const persist = (entity: any, entityProperty: string): void => { //eslint-disable-line
    const objectProperties: string[] = Reflect.getMetadata('entity:properties', entity) || [];
    if (!objectProperties.includes(entityProperty)) {
        objectProperties.push(entityProperty);
        Reflect.defineMetadata('entity:properties', objectProperties, entity);
    }
}

/**
 * Defines meta data property for an entity ID.
 * @param entity            the entity.
 * @param entityProperty    the entity property.
 */
const id = <T>(entity: T, entityProperty: string): void => {
    Reflect.defineMetadata('entity:id', entityProperty, entity);
}

export {
    entity as Entity,
    persist as Persist,
    id as ID
}
