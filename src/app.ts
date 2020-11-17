import { Server } from './core/Server';
import { JsonDbRepository } from './core';
import { MongoRepository } from './core/repository/MongoRepository';
import Example2 from './entites/Example2';
import Example from './entites/Example';

/**
 * Create a new Server and add entities.
 * If you wish, add cors origins, applyBodyparser or any other middleware by chaining
 * the implemented functions.
 * Create an entity class and then call addEntity() as shown below.
 * One can use either JsonDB which is provided as a dependency and create a db.json file in root of the application,
 * or one can connect to a MongoRepository and provide a Mongo-uri and a database name.
 *
 * One can easily create a new repository that extends BaseRepository and connects to database of choice,
 * but keep in mind that the EntityRouter may be modified depending on what database you choose, or that the new repository
 * must return values in the same manner as the Existing Repositories do.
 *
 * Different databases can also be used if that is desirable
 *
 * When done call just start() and a complete CRUD server should start.
 */
new Server()
    .useCors()
    .applyBodyParser()
    // .addEntity<Example>(Example, new MongoRepository<Example>('mongodb://admin:password@localhost:27000', 'example'))
    .addEntity<Example>(Example, new JsonDbRepository<Example>('example'))
    .addEntity<Example2>(Example2, new JsonDbRepository<Example>('example2'))
    .start();
