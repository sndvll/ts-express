import { BaseRepository } from './BaseRepository';
import { BaseEntity } from '../entity';
import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

const MONGO_CLIENT_DEFAULT_OPTIONS = {
    useUnifiedTopology: true
}

export class MongoRepository<T extends BaseEntity> extends BaseRepository<T> {

    private _db: Db;
    private _collection: Collection<any>;

    constructor(private uri: string, private dbName: string, private options: MongoClientOptions = {}) {
        super();
        this._connect();
    }

    public create(entity: T) {
        return this._collection.insertOne({...entity});
    }

    public delete(id: string) {
        return this._collection.findOneAndDelete({id});
    }

    public fetchAll() {
        return this._collection.find().toArray();
    }

    public fetchOne(id: string) {
        return this._collection.findOne({id});
    }

    public update(updatedData: any, id: string) {
        return this._collection.findOneAndUpdate({id}, {$set: updatedData})
            .then(() => this._collection.findOne({id}))
            .then(res => {
                const entity = {...res};
                delete entity['_id'];
                return entity;
            });
    }

    private _connect() {
        MongoClient.connect(this.uri, {...MONGO_CLIENT_DEFAULT_OPTIONS, ...this.options})
            .then(client => {
                this._db = client.db(this.dbName);
                this._collection = this._db.collection(this.route);
                console.log('Connected to mongo database: ' + this._db.databaseName);
                console.log(`Collection: ${this.route}`);
            })
            .catch(err => console.log('Mongo connection error:', err));
    }
}
