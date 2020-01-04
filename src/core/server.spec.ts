import { Server } from './server';

describe('test server class', () => {

    let server: Server;

    beforeEach(() => {
        server = new Server();
    });

    it('should create an instance of the server', () => {
        expect(server).toBeDefined();
    });
});
