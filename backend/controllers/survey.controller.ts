import { Request, Response } from 'express';
import { SurveyService } from '../services/survey.service';

export class SurveyController {
  
  static async create(req: Request, res: Response) {
    const result = await SurveyService.create(req.body);
    res.status(201).json(result);
  }

  static async updateById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const result = await SurveyService.updateById(id, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error en update:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const result = await SurveyService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const survey = await SurveyService.getById(id);
      if (!survey) {
        return res.status(404).json({ error: 'Encuesta no encontrada' });
      }
      res.json(survey);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteById(req: Request, res: Response) {
    
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    try {
      const result = await SurveyService.deleteById(id);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error desconocido' });
      }
    }
  }

  static async publish(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const result = await SurveyService.publish(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async enable(req: Request, res: Response) {
    
    const id = Number(req.params.id);
    const { isEnable } = req.body;

    if (isNaN(id) || typeof isEnable !== 'boolean') {
      return res.status(400).json({ error: 'Parámetros inválidos' });
    }

    try {
      const updated = await SurveyService.enable(id, isEnable);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}