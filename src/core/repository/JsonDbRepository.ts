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
export class JsonDbRepository<T extends BaseEntity> extends BaseRepository<T> {

    private _db: JsonDB;

    constructor(public name: string) {
        super();
        this._db = new JsonDB(new Config('db', true, true, '/'));
        console.log(`JsonDB Entity "${this.name}" initialized`);
    }

    public fetchAll(): Promise<T[]> {
        return new Promise<T[]>(((resolve, reject) => {
            resolve(Object.values(this._db.getData(`/${this.name}`)))
        }));
    }

    public fetchOne(id: string): Promise<T> {
        return new Promise<T>(((resolve, reject) => {
            resolve(this._db.getData(`/${this.name}/${id}`))
        }));
    }

    public create(entity: T): Promise<T> {
        return new Promise<T>(((resolve, reject) => {
            this._db.push(`/${this.name}/${entity.id}`, entity.getPersistenceObject());
            resolve(this._db.getData(`/${this.name}/${entity.id}`))
        }));
    }

    public update(updatedData: Partial<T>, id: string): Promise<T> {
        this._db.push(`/${this.name}/${id}`, updatedData, false);
        return new Promise<T>(((resolve, reject) => {
            resolve(this._db.getData(`/${this.name}/${id}`))
        }));
    }

    public delete(id: string): Promise<void> {
        return new Promise<void>(((resolve, reject) => {
            this._db.delete(`/${this.name}/${id}`);
            resolve();
        }));
    }

}
