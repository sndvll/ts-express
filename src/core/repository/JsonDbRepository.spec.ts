import { JsonDbRepository } from './JsonDbRepository';
import { BaseEntity } from '../entity';

class MockEntity implements BaseEntity {
    constructor(public id: string)  {}
    public getPersistenceObject() {
        return jest.fn();
    }
}

jest.mock('node-json-db', () => ({
    JsonDB: jest.fn(() => ({
        push: jest.fn(),
        getData: jest.fn(),
        delete: jest.fn()
    }))
}));

describe('JsonDbRepository tests', () => {
    let repo: JsonDbRepository<MockEntity>;

    beforeEach(() => {
        repo = new JsonDbRepository<MockEntity>('mock');
    });

    it('should create a entity repository instance', () => {
        expect(repo).toBeDefined();
    });

    it('should call the db getData function when fetching all', () => {
        const spy = spyOn(repo['_db'], 'getData').and.stub();
        repo.fetchAll();
        expect(spy).toBeCalledWith('/mock');
    });

    it('should call the db getData function when fetching one', () => {
        const spy = spyOn(repo['_db'], 'getData').and.stub();
        repo.fetchOne('1');
        expect(spy).toBeCalledWith('/mock/1');
    });
});
