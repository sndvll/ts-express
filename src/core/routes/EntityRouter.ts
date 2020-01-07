import shortid from 'shortid';
import express, { Router, Request, Response } from 'express';
import { EntityRepository } from '../repository/EntityRepository';
import { BaseEntity } from '../entity/BaseEntity';
import { Log, validate } from '../decorators';
import { EntityTypeInstance, EntityFactory } from '../entity';
import { BaseRepository } from '../repository/BaseRepository';

/**
 * Entity router.
 * Generic class for all CRUD entites.
 */
export class EntityRouter<T extends BaseEntity> {

    private _router: Router;

    get router(): Router {
        return this._router;
    }

    constructor(public name: string, private classRef: EntityTypeInstance<T>, private repo: BaseRepository<T>) {
        this._router = express.Router();
        this.addEntityRoutes();
    }

    private addEntityRoutes() {
        this._router
            .post('/', (req, res) => this.createEntity(req, res))
            .get('/', (req, res) => this.fetchAllEntities(req, res))
            .get('/:id', (req, res) => this.fetchEntity(req, res))
            .put('/:id', (req, res) => this.updateEntity(req, res))
            .delete('/:id', (req, res) => this.deleteEntity(req, res));
    }

    @Log
    private fetchAllEntities(req: Request, res: Response) {
        res.json(this.repo.fetchAll());
    }

    @Log
    private fetchEntity(req: Request, res: Response) {
        res.json(this.repo.fetchOne(req.params.id));
    }

    @Log
    private createEntity(req: Request, res: Response) {
        const newEntity = EntityFactory.fromPersistenceObject<T>(req.body, this.classRef);
        const errorMap = validate(newEntity);
        if (Object.keys(errorMap).length > 0) {
            const output = { errors: errorMap };
            res.status(400).json(output);
            return;
        }
        const idProperty = Reflect.getMetadata('entity:id', newEntity);
        newEntity[idProperty] = shortid.generate();
        this.repo.create(newEntity, idProperty);
        res.status(200).json(newEntity);
    }

    @Log
    private updateEntity(req: Request, res: Response) {
        let data = {} as T;
        try {
            data = this.repo.fetchOne(req.params.id);
        } catch (err) {
            res.status(404).json({ error: 'Object does not exist' });
            return;
        }

        const updatedData = req.body;
        const updatedObj = EntityFactory.fromPersistenceObject(data, this.classRef);
        const propKeys = Object.keys(updatedData);
        for (const propKey of propKeys) {
            updatedObj[propKey] = updatedData[propKey];
        }

        const errorMap = validate(updatedObj);
        if (Object.keys(errorMap).length > 0) {
            const output = { errors: errorMap };
            res.status(400).json(output);
            return;
        }
        res.json(this.repo.update(updatedData, req.params.id));
    }

    @Log
    private deleteEntity(req: Request, res: Response) {
        this.repo.delete(req.params.id);
        res.json({});
    }

}
