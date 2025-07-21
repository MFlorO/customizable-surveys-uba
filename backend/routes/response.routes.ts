import { Router } from 'express';
import { ResponseController } from '../controllers/response.controller';

const router = Router();

router.post('/', ResponseController.submit);
router.get('/:id', ResponseController.getById); 
router.get('/survey/:id', ResponseController.getAllBySurveyId);

export default router;



// | Método | Ruta                    | Acción                                                                |
// |--------|-------------------------|-----------------------------------------------------------------------|
// | POST   | `/response`            | Enviar una respuesta a una encuesta publicada                         |
// | GET    | `/response/:id`        | Obtener una respuesta completa agrupada por secciones y preguntas     |
// | GET    | `/response/surveys/:id`| Obtener todas las respuestas enviadas para una encuesta específica    |
