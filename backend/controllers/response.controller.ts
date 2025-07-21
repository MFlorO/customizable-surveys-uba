import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../services/response.service';

export class ResponseController {
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ResponseService.submitResponse(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const responseId = Number(req.params.id);
      const result = await ResponseService.getDetailedResponse(responseId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllBySurveyId(req: Request, res: Response, next: NextFunction) {
    try {
      const surveyId = Number(req.params.id);
      const result = await ResponseService.getAllBySurveyId(surveyId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

}
