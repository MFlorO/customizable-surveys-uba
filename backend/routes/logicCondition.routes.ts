import { Router } from 'express';
import { LogicConditionController } from '../controllers/logicCondition.controller';

const router = Router();

router.post('/', LogicConditionController.create);
router.put('/:id', LogicConditionController.update);
router.delete('/:id', LogicConditionController.delete);
router.get('/:id', LogicConditionController.getById);

export default router;


// | Método | Ruta                                 | Acción                                                                 |
// |--------|--------------------------------------|------------------------------------------------------------------------|
// | POST   | `/api/logic-conditions`              | Crear una condición lógica (FINALIZE o DISABLE_QUESTION)              |
// | PUT    | `/api/logic-conditions/:id`          | Editar una condición lógica                                           |
// | DELETE | `/api/logic-conditions/:id`          | Eliminar una condición lógica                                         |
// | GET    | `/api/logic-conditions/question/:questionId` | Obtener todas las condiciones de una pregunta               |
// | GET    | `/api/logic-conditions/:id`          | Obtener una condición lógica por su ID                              |
