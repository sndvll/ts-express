import { Entity, Persist, Required, IsInteger, Length } from '../core/decorators';
import { BaseEntity } from '../core';

/**
 * Class Example.
 * Simple example of how to create an entity.
 * By annotating @Entity and extend BaseEntity routes for CRUD operations
 * will be created at compile time.
 */
@Entity('example')
export default class Example extends BaseEntity {

    @Persist
    @Required
    @Length(1, 200)
    public data!: string;

    @Persist
    @Required
    @IsInteger(1, 10)
    public aNumber!: number;

}
