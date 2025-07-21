import { Request, Response, NextFunction } from 'express';
import { LogicConditionService } from '../services/logicCondition.service';

export class LogicConditionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const logic = await LogicConditionService.create(req.body);
      res.status(201).json(logic);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const logic = await LogicConditionService.update(Number(req.params.id), req.body);
      res.json(logic);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await LogicConditionService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const logic = await LogicConditionService.getById(Number(req.params.id));
      res.json(logic);
    } catch (error) {
      next(error);
    }
  }

  static async getByQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const logics = await LogicConditionService.getByQuestion(Number(req.params.questionId));
      res.json(logics);
    } catch (error) {
      next(error);
    }
  }
}
