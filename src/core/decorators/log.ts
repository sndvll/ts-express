import { Request, Response } from 'express';

/**
 * Decorator for logging when a route is processing a request.
 * @param target        the target router.
 * @param propertyKey   the router method.
 * @param descriptor    the method descriptor.
 */
const logRoute = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        const req = args[0] as Request;
        const res = args[1] as Response;
        original.apply(this, args);
        console.log(`${req.ip} [${new Date().toISOString()}] ${req.hostname} ${req.originalUrl} ${req.method} ${res.statusCode} ${res.statusMessage} HTTP/${req.httpVersion}`);
        if (['PUT', 'POST'].indexOf(req.method) > -1) {
            console.log(`\tBODY: ${JSON.stringify(req.body)}`);
        }
    }
}

export {
    logRoute as Log
}
