import shortid from 'shortid';
import express, { Router, Request, Response } from 'express';
import { BaseEntity } from '../entity/BaseEntity';
import { Log, validate } from '../decorators';
import { EntityTypeInstance, EntityFactory } from '../entity';
import { BaseRepository } from '../repository/BaseRepository';

/**
 * Entity router.
 * Generic class for all CRUD entites.
 */
export class EntityRouter<T extends BaseEntity> {

    private readonly _router: Router;

    get router(): Router {
        return this._router;
    }

    constructor(private classRef: EntityTypeInstance<T>, private repo: BaseRepository<T>) {
        this._router = express.Router();
        this.repo.route = Reflect.getMetadata('entity:name', this.classRef);
        this.addEntityRoutes();
    }

    private addEntityRoutes() {
        this._router
            .post('/', (req, res): void => void this.createEntity(req, res))
            .get('/', (req, res) => void this.fetchAllEntities(req, res))
            .get('/:id', (req, res) => void this.fetchEntity(req, res))
            .put('/:id', (req, res) => void this.updateEntity(req, res))
            .delete('/:id', (req, res) => void this.deleteEntity(req, res));
    }

    @Log
    private async fetchAllEntities(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.repo.fetchAll();
            result.forEach((entity: any) => delete entity['_id']); // Funky any typing here for the mongo obj
            res.json(result);
        } catch (error) {
            this._handleError(error, res);
        }
    }

    @Log
    private async fetchEntity(req: Request, res: Response) {
        try {
            const entity: any = await this.repo.fetchOne(req.params.id); // Funky any typing here for the mongo obj
            delete entity['_id'];
            res.json(entity);
        } catch (error) {
            this._handleError(error, res);
        }
    }

    @Log
    private async createEntity(req: Request, res: Response) {
        try {
            const newEntity = EntityFactory.fromPersistenceObject<T>(req.body, this.classRef);
            const errorMap = validate(newEntity);
            if (Object.keys(errorMap).length > 0) {
                const output = {errors: errorMap};
                res.status(400).json(output);
                return;
            }
            const id: string = Reflect.getMetadata('entity:id', newEntity);
            newEntity[id] = shortid.generate();
            await this.repo.create(newEntity);
            res.status(200).json(newEntity);
        } catch (error) {
            this._handleError(error, res);
        }
    }

    @Log
    private async updateEntity(req: Request, res: Response) {

        try {
            const data: any = await this.repo.fetchOne(req.params.id);
            delete data['_id'];
            const updatedData: any = req.body;
            const updatedObj = EntityFactory.fromPersistenceObject(data, this.classRef);
            const propKeys = Object.keys(updatedData);
            for (const propKey of propKeys) {
                updatedObj[propKey] = updatedData[propKey];
            }

            const errorMap = validate(updatedObj);
            if (Object.keys(errorMap).length > 0) {
                const output = {errors: errorMap};
                res.status(400).json(output);
                return;
            }
            const entity = await this.repo.update(updatedData, req.params.id);
            res.json(entity);
        } catch (error) {
            this._handleError(error, res);
        }
    }

    @Log
    private async deleteEntity(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id);
            res.send();
        } catch (error) {
            this._handleError(error, res);
        }
    }

    private _handleError(error: any | Error, res: Response) {
        // TODO HANDLE ERRORS IN A CORRECT MANNER FROM REPOS!
        console.log('error', error?.message); //eslint-disable-line
        res.status(500).send({error: 500, message: error?.message}); // eslint-disable-line
    }
}
