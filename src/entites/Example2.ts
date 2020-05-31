import { Entity, Persist, Required, Length } from '../core/decorators';
import { BaseEntity } from '../core';

/**
 * EXAMPLE 2
 */
@Entity('example2')
export default class Example2 extends BaseEntity {

    @Persist
    @Required
    @Length(1, 200)
    public data: string;

}
