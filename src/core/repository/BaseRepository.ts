/**
 * Base repository class. Abstract class that all repositories extends.
 */
export abstract class BaseRepository<T> {

    constructor(public name: string) {}

    public abstract fetchAll(): T[];
    public abstract fetchOne(id: string): T;
    public abstract create(entity: T, idProperty: string): T;
    public abstract update(updatedData: any, id: string): T;
    public abstract delete(id: string): void;
}
