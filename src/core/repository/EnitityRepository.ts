import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { BaseRepository } from './BaseRepository';
import { BaseEntity } from '../entity/BaseEntity'

/**
 * Entity repository.
 * Handles all CRUD operations between the router and the database.
 * In this version JsonDB is used. Replace JsonDB with database of choice,
 * tentatively MongoDB and Mongoose.
 */
export class EntityRepository<T extends BaseEntity> extends BaseRepository<T> {

    private _db: JsonDB;

    constructor(public name: string) {
        super(name);
        this._db = new JsonDB(new Config('db', true, true, '/'));
    }

    public fetchAll(): T[] {
        return this._db.getData(`/${this.name}`);
    }

    public fetchOne(id: string): T {
        return this._db.getData(`/${this.name}/${id}`)
    }

    public create(entity: T, idProperty: string): T {
        this._db.push(`/${this.name}/${entity[idProperty]}`, entity.getPersistenceObject());
        return this._db.getData(`/${this.name}/${entity.id}`);
    }

    public update(updatedData: any, id: string): T {
        this._db.push(`/${this.name}/${id}`, updatedData, false);
        return this._db.getData(`/${this.name}/${id}`);
    }

    public delete(id: string): void {
        this._db.delete(`/${this.name}/${id}`);
    }

}
