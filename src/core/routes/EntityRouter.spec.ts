import { BaseEntity } from '../entity/BaseEntity';
import { EntityRouter } from './EntityRouter';
import { BaseRepository } from '../repository/BaseRepository';

class MockRepository implements BaseRepository<MockEntity> {
    public fetchAll = jest.fn();
    public fetchOne = jest.fn();
    public create = jest.fn()
    public update = jest.fn()
    public delete = jest.fn()
    constructor(public name: string) {}
}

class MockEntity implements BaseEntity {
    public id: '1';
    public getPersistenceObject = () => jest.fn();
}

jest.mock('../repository/EntityRepository', () => ({
    EntityRepository: jest.fn(() => new MockRepository(''))
}));

jest.mock('../entity/EntityFactory', () => ({
    EntityFactory: jest.fn(() => ({
        fromPersistenceObject: jest.fn()
    }))
}));

describe('EntityRouter tests', () => {

    let router: EntityRouter<MockEntity>;

    beforeEach(() => {
        router = new EntityRouter<MockEntity>('mockEntity', MockEntity);
    });

    it('should create a router instance', () => {
        expect(router).toBeDefined();
    });
});
