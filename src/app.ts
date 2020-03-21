<<<<<<< HEAD
import { Server } from './core/Server';
import Example from './entites/example';
import { EntityRepository } from './core';
=======
import { Server } from './core/server';
import Example from './entites/Example';
>>>>>>> 6a4601f4be38873835505be95c33e30be1121d49

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
    .addEntity<Example>(Example, new EntityRepository<Example>('example'))
    .start();
