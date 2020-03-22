import { Server } from './core/Server';
import Example from './entites/Example';
import { JsonDbRepository } from './core';
import {MongoRepository} from './core/repository/MongoRepository';
import Example2 from './entites/Example2';


/**
 * Create a new Server and add entities.
 * If you wish, add cors origins, applyBodyparser or any other middleware by chaining
 * the implemented functions.
 * Create an entity class and then call addEntity() as shown below.
 * The class EntityRepository is using a simple instance of JsonDB that holds the
 * entites in a .json-file in the root folder.
 * One can easily create a new repository that extends BaseRepository that connects to database
 * of choice.
 *
 * When done call just start() and a complete CRUD server should start.
 */
new Server()
    .useCors()
    .applyBodyParser()
    // .addEntity<Example>(Example, new JsonDbRepository<Example>('example'))
    .addEntity<Example>(Example, new MongoRepository<Example>('mongodb://admin:password@localhost:27000', 'example'))
    .addEntity<Example2>(Example2, new MongoRepository<Example2>('mongodb://admin:password@localhost:27000', 'example'))
    .start();
