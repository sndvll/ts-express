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
        console.log(`JsonDB ${this.name} initialized`);
    }

    public fetchAll() {
        return new Promise<T[]>(((resolve, reject) => {
            resolve(Object.values(this._db.getData(`/${this.name}`)))
        }));
    }

    public fetchOne(id: string) {
        return new Promise<T>(((resolve, reject) => {
            resolve(this._db.getData(`/${this.name}/${id}`))
        }));
    }

    public create(entity: T) {
        return new Promise<T>(((resolve, reject) => {
            this._db.push(`/${this.name}/${entity.id}`, entity.getPersistenceObject());
            resolve(this._db.getData(`/${this.name}/${entity.id}`))
        }));
    }

    public update(updatedData: any, id: string) {
        this._db.push(`/${this.name}/${id}`, updatedData, false);
        return new Promise<T>(((resolve, reject) => {
            resolve(this._db.getData(`/${this.name}/${id}`))
        }));
    }

    public delete(id: string) {
        return new Promise<T>(((resolve, reject) => {
            this._db.delete(`/${this.name}/${id}`);
            resolve();
        }));
    }

}
