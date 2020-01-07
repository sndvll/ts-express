import { Server } from './Server';
import { BaseEntity } from './entity/BaseEntity';

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

    it('should create an instance of the server with default config and default origins', () => {
        expect(server).toBeDefined();
        expect(server['config'].port).toBe(5000);
        expect(server['config'].apiVersion).toBe('v1');
        expect(server['config'].origins).toEqual(['http://localhost:4200', 'http://localhost:3000']);
        expect(server['_app']).toBeDefined();
    });

    it('should create a server with custom config', () => {
        server = new Server({
            port: 2000,
            apiVersion: 'v2',
            origins: ['http://someOrigin']
        });
        expect(server['config'].port).toBe(2000);
        expect(server['config'].apiVersion).toBe('v2');
        expect(server['config'].origins).toEqual(['http://someOrigin']);
        expect(server['_app']).toBeDefined();
    });

    it('should call express use function when adding an entity', () => {
        const useSpy = spyOn(server['_app'], 'use').and.stub();
        expect(server.addEntity<MockEntity>(MockEntity)).toBe(server);
        expect(useSpy).toBeCalledTimes(1);
    });

    it('should call the express listen function when starting server', () => {
        const spy = spyOn(server['_app'], 'listen');
        expect(server.start()).toBe(server);
        expect(spy).toBeCalledTimes(1);
    });

});
