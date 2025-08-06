import { Router } from 'express';
const router = Router();
import { SurveyController } from '../controllers/survey.controller';
import { validate } from '../middleware/validate';
import { createSurveySchema, updateSurveySchema } from '../validators/survey.validator';

router.post('/', validate(createSurveySchema), SurveyController.create);
router.put('/:id', validate(updateSurveySchema), SurveyController.updateById);
router.get('/', SurveyController.getAll);
router.get('/:id', SurveyController.getById);
router.delete('/:id', SurveyController.deleteById);
router.patch('/:id/publish', SurveyController.publish);
router.patch('/:id/enable', SurveyController.enable);

module.exports = router;

// DOCUMENTACIÓN
// | Método | Ruta                   | Acción                                     |
// | ------ | -----------------------| -------------------------------------------|
// | POST   | `/surveys`             | Crear encuesta                             |
// | PUT    | `/surveys/:id`         | Editar título/descripción (si DRAFT)       |
// | POST   | `/surveys/:id/publish` | Publicar encuesta (cambiar a PUBLISHED)    |
// | GET    | `/surveys`             | Listar todas las encuestas                 |
// | GET    | `/surveys/:id`         | Ver una encuesta con secciones y preguntas |
// | DELETE | `/surveys/:id`         | Borrar encuesta por id                     |


//* ANOTACIONES PARA SWAGGER

/**
 * @swagger
 * tags:
 *   - name: Surveys
 *     description: Gestión de encuestas
 */

/**
 * @swagger
 * /survey:
 *   post:
 *     summary: Crea una nueva encuesta
 *     tags: [Surveys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       201:
 *         description: Encuesta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Error de validación o datos inválidos
 */

/**
 * @swagger
 * /survey/{id}:
 *   put:
 *     summary: Actualiza una encuesta por ID (solo si está en DRAFT)
 *     tags: [Surveys]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       201:
 *         description: Encuesta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Error en los datos enviados o la encuesta no está en estado DRAFT
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /survey:
 *   get:
 *     summary: Obtiene todas las encuestas
 *     tags: [Surveys]
 *     responses:
 *       200:
 *         description: Lista de encuestas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Survey'
 */

/**
 * @swagger
 * /survey/{id}:
 *   get:
 *     summary: Obtiene una encuesta por ID (incluye secciones, preguntas, opciones)
 *     tags: [Surveys]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /survey/{id}:
 *   delete:
 *     summary: Elimina una encuesta por ID
 *     tags: [Surveys]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Survey'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /survey/{id}/publish:
 *   patch:
 *     summary: Publica una encuesta (cambia estado a PUBLISHED)
 *     tags: [Surveys]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta a publicar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta publicada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       400:
 *         description: La encuesta ya está publicada o error en la publicación
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /survey/{id}/enable:
 *   patch:
 *     summary: Habilita o deshabilita una encuesta publicada
 *     tags: [Surveys]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Estado de habilitación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isEnable
 *             properties:
 *               isEnable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Encuesta habilitada/deshabilitada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Parámetros inválidos o encuesta no publicada
 *       404:
 *         description: Encuesta no encontrada
 */