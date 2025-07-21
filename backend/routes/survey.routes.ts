import { Router } from 'express';
const router = Router();
import { SurveyController } from '../controllers/survey.controller';
import { validate } from '../middleware/validate';
import { createSurveySchema, updateSurveySchema } from '../validators/survey.validator';

router.post('/', validate(createSurveySchema), SurveyController.create);
router.put('/:id', validate(updateSurveySchema), SurveyController.updateById);
router.post('/:id/publish', SurveyController.publish);
router.get('/', SurveyController.getAll);
router.get('/:id', SurveyController.getById);
router.delete('/:id', SurveyController.deleteById);

module.exports = router;

// | Método | Ruta                   | Acción                                     |
// | ------ | -----------------------| -------------------------------------------|
// | POST   | `/surveys`             | Crear encuesta                             |
// | PUT    | `/surveys/:id`         | Editar título/descripción (si DRAFT)       |
// | POST   | `/surveys/:id/publish` | Publicar encuesta (cambiar a PUBLISHED)    |
// | GET    | `/surveys`             | Listar todas las encuestas                 |
// | GET    | `/surveys/:id`         | Ver una encuesta con secciones y preguntas |
// | DELETE | `/surveys/:id`         | Borrar encuesta por id                     |
