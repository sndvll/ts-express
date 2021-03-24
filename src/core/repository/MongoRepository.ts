import { BaseRepository } from './BaseRepository';
import { BaseEntity } from '../entity';
import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

const MONGO_CLIENT_DEFAULT_OPTIONS = {
    useUnifiedTopology: true
}

export class MongoRepository<T extends BaseEntity> extends BaseRepository<T> {

    private _db!: Db;
    private _collection!: Collection<any>;

    constructor(private uri: string, private dbName: string, private options: MongoClientOptions = {}) {
        super();
        this._connect();
        console.log(`MongoDB Entity "${this.dbName}" initialized`);
    }

    public create(entity: T): Promise<unknown> {
        return this._collection.insertOne({...entity});
    }

    public delete(id: string): Promise<unknown> {
        return this._collection.findOneAndDelete({id});
    }

    public fetchAll(): Promise<T[]>  {
        return this._collection.find().toArray() as Promise<T[]>;
    }

    public fetchOne(id: string): Promise<T>  {
        return this._collection.findOne({id}) as Promise<T>;
    }

    public async update(updatedData: Partial<T>, id: string): Promise<T>  { //eslint-disable-line
        await this._collection.findOneAndUpdate({ id }, { $set: updatedData });
        const res = await this._collection.findOne({ id });
        const entity: any = { ...res }; // Funky any typing here for the mongo obj
        delete entity['_id'];
        return entity; //eslint-disable-line
    }

    private _connect(): void {
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
