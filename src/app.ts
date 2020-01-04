import { Server } from './core/server';
import Example from './entites/example';

/**
 * Create a new Server and add entities.
 * addEntity() returns the server instance so when done just call start().
 *
 * This example is using a simple instance of JsonDB that holds the
 * entitis in a .json-file in the root folder.
 * One can easily create a new repository that connects to database
 * of choice.
 */
new Server()
    .addEntity<Example>(Example)
    .start();
