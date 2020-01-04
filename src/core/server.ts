import * as http from 'http';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'reflect-metadata';
import { BaseEntity, EntityRouter } from '.';

export interface ServerConfig {
    port: number;
    apiVersion?: string;
}

/**
 * Class Server. Creates the Express server. Handles cors and middlewares.
 */
export class Server {

    private _origins = ['http://localhost:4200', 'http://localhost:3000'];

    private _app: Express;

    private _server: http.Server
    get server(): http.Server {
        return this._server;
    }

    /**
     * Server constructor. Takes a server configuration object.
     * Add middlwares here.
     * @param config    The server configuration. Default port is set to 5000 and apiVersion is set to v1.
     */
    constructor(private config: ServerConfig = { port: 5000, apiVersion: 'v1' }) {
        this._app = express()
            .set('port', this.config.port)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))
            .use(cors({origin: this._origins}));
    }

    /**
     * Sets cors origins array. Default is set to localhost and ports 3000 and 4200 (default react and angular ports).
     * For production this must be overriden, and called before start function.
     * Returns an instance of the server for chaining when creating the server.
     * @param origins   the cors origin urls.
     */
    public setOrigins(origins: string[]): Server {
        this._origins = origins;
        return this;
    }

    /**
     * Adds an entity and creates a entity router.
     * Returns an instance of the server for chaining when creating the server.
     * @param clazz     the entity class
     */
    public addEntity<T extends BaseEntity>(clazz: any): Server {
        const name = Reflect.getMetadata('entity:name', clazz);
        const entityRouter = new EntityRouter<T>(name, clazz);
        this._app.use(`/${this.config.apiVersion}/${name}`, entityRouter.router);
        return this;
    }

    /**
     * Starts the server and logs to console when running.
     * Returns an instance of the server.
     */
    public start(): Server {
        const { apiVersion, port } = this.config;
        this._server = this._app.listen(this.config.port, () =>
            console.info(`API version ${apiVersion} is running on port ${port}`));
        return this;
    }
}
