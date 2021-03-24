import { Server } from './Server';
import { BaseEntity } from './entity/BaseEntity';
import { JsonDbRepository } from './repository/JsonDbRepository';

jest.mock('./routes/EntityRouter', () => ({
    EntityRouter: jest.fn(() => ({
        router: jest.fn()
    }))
}));

class MockEntity implements BaseEntity {
    public id: '1';
    public getPersistenceObject = () => jest.fn();
}

describe('Server tests', () => {

    let server: Server;

    beforeEach(() => {
        server = new Server();
    });

    it('should create an instance of the server', () => {
        expect(server['_app']).toBeDefined();
    });

    it('should create a server with custom config', () => {
        server = new Server('server', 'v2')
            .setPort(2000)
            .useCors(['http://someOrigin']);
        expect(server['_port']).toBe(2000);
        expect(server['apiUrl']).toBe('server');
        expect(server['apiVersion']).toBe('v2');
        expect(server['_app']).toBeDefined();
    });

    it('should call express use function when adding an entity', () => {
        const useSpy = spyOn(server['_app'], 'use').and.stub();
        expect(server.addEntity<MockEntity>(MockEntity, new JsonDbRepository('test'))).toBe(server);
        expect(useSpy).toBeCalledTimes(1);
    });

    it('should call the express listen function when starting server', () => {
        const spy = spyOn(server['_app'], 'listen');
        expect(server.start()).toBe(server);
        expect(spy).toBeCalledTimes(1);
    });

});
