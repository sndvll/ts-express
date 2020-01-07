import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'reflect-metadata';

import { BaseEntity } from './entity/BaseEntity';
import { EntityRouter } from './routes/EntityRouter';

export interface ServerConfig {
    port: number;
    apiVersion: string;
    origins: string[];
}

/**
 * Class Server. Creates the Express server. Handles cors and middlewares.
 */
export class Server {

    private _app: Express;

    /**
     * Server constructor. Takes a server configuration object.
     * Add middlwares here.
     * @param config    The server configuration. Default port is set to 5000,
     *                  apiVersion is set to v1 and origins is set to
     *                  standard react/angular localhost urls.
     */
    constructor(private config: ServerConfig = { port: 5000, apiVersion: 'v1', origins: ['http://localhost:4200', 'http://localhost:3000'] }) {
        this._app = express()
            .set('port', this.config.port)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))
            .use(cors({origin: this.config.origins}));
    }

    /**
     * Adds an entity and creates a entity router.
     * Returns an instance of the server for chaining when creating the server.
     * @param clazz     the entity class
     */
    public addEntity<T extends BaseEntity>(clazz: any): Server {
        const name = Reflect.getMetadata('entity:name', clazz);
        this._app.use(`/${this.config.apiVersion}/${name}`, new EntityRouter<T>(name, clazz).router);
        return this;
    }

    /**
     * Starts the server and logs to console when running.
     * Returns an instance of the server.
     */
    public start(): Server {
        const { apiVersion, port } = this.config;
        this._app.listen(this.config.port, () => console.info(`API version ${apiVersion} is running on port ${port}`));
        return this;
    }
}
