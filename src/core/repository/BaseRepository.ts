/**
 * Base repository class. Abstract class that all repositories extends.
 */
export abstract class BaseRepository<T> {

    public route: string;

    public abstract fetchAll(): Promise<any[]>;
    public abstract fetchOne(id: string): Promise<any>;
    public abstract create(entity: T): Promise<any>;
    public abstract update(updatedData: any, id: string): Promise<any>;
    public abstract delete(id: string): Promise<any>;
}
