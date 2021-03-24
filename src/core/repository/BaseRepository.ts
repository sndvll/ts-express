/**
 * Base repository class. Abstract class that all repositories extends.
 */
export abstract class BaseRepository<T> {

    public route!: string;

    public abstract fetchAll(): Promise<T[]>;
    public abstract fetchOne(id: string): Promise<T>;
    public abstract create(entity: T): Promise<unknown>;
    public abstract update(updatedData: Partial<T>, id: string): Promise<T>;
    public abstract delete(id: string): Promise<unknown>;
}
