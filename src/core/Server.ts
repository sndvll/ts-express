import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'reflect-metadata';

import { BaseEntity } from './entity/BaseEntity';
import { EntityRouter } from './routes/EntityRouter';
import { JsonDbRepository } from './repository/JsonDbRepository';
import { BaseRepository } from './repository/BaseRepository';

/**
 * Class Server. Creates the Express server. Handles cors and middlewares.
 */
export class Server {

    private _app: Express;
    private _port: number = 5000;

    /**
     * Server constructor.
     * @param apiVersion    Optional. Sets the apiVersion for all routes.
     */
    constructor(private apiVersion: string = 'v1') {
        this._app = express();
    }

    /**
     * Sets the server port. Default is 5000.
     * Returns an instance of the server for chaining when creating the server.
     * @param port      The port.
     */
    public setPort(port: number): Server {
        this._port = port;
        return this;
    }

    /**
     * Call this in the chain if you wish to use bodyParser.
     * Returns an instance of the server for chaining when creating the server.
     * @param extended      Optional. urlEncoded extended. Default is true.
     */
    public applyBodyParser(extended: boolean = true): Server {
        this._app
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended }))
        return this;
    }

    /**
     * Call this to use CORS-origin/s.
     * Returns an instance of the server for chaining when creating the server.
     * @param origins   The origin urls. Default is localhost:4200/3000.
     */
    public useCors(origins: string[] = ['http://localhost:4200', 'http://localhost:3000']): Server {
        this._app.use(cors({ origin: origins }));
        return this;
    }

    /**
     * Call this to apply any other middleware.
     * Returns an instance of the server for chaining when creating the server.
     * @param middleware    the middleware, any type.
     */
    public applyMiddleware(middleware: any): Server {
        try {
            this._app.use(middleware);
        } catch (error) {
            console.error('Not valid middleware.', error);
        }
        return this;
    }

    /**
     * Adds an entity and creates a entity router.
     * Returns an instance of the server for chaining when creating the server.
     * @param clazz     the entity class
     */
    public addEntity<T extends BaseEntity>(clazz: any, repo: BaseRepository<T>): Server {
        const name = Reflect.getMetadata('entity:name', clazz);
        this._app.use(`/${this.apiVersion}/${name}`, new EntityRouter<T>(clazz, repo).router);
        return this;
    }

    /**
     * Starts the server and logs to console when running.
     * Returns an instance of the server.
     */
    public start(): Server {
        this._app.listen(this._port, () => console.info(`API version ${this.apiVersion} is running on port ${this._port}`));
        return this;
    }
}
