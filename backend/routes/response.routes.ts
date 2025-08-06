import { Router } from 'express';
import { ResponseController } from '../controllers/response.controller';

const router = Router();

router.post('/', ResponseController.submit);
router.get('/:id', ResponseController.getById); 
router.get('/survey/:id', ResponseController.getAllBySurveyId);

module.exports = router;


// | Método | Ruta                   | Acción                                                                |
// |--------|------------------------|-----------------------------------------------------------------------|
// | POST   | `/response`            | Enviar una respuesta a una encuesta publicada                         |
// | GET    | `/response/:id`        | Obtener una respuesta completa agrupada por secciones y preguntas     |
// | GET    | `/response/surveys/:id`| Obtener todas las respuestas enviadas para una encuesta específica    |


//* ANOTACIONES PARA SWAGGER

/**
 * @swagger
 * /response:
 *   post:
 *     summary: Enviar una respuesta a una encuesta publicada
 *     tags:
 *       - Response
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 example: 1
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 101
 *                     optionCodes:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *                     textAnswer:
 *                       type: string
 *                       example: "Respuesta escrita"
 *                     numericAnswer:
 *                       type: number
 *                       example: 5
 *     responses:
 *       201:
 *         description: Respuesta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 surveyId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error en los datos enviados
 */

/**
 * @swagger
 * /response/{id}:
 *   get:
 *     summary: Obtener una respuesta agrupada por secciones y preguntas
 *     tags:
 *       - Response
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la respuesta
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalle de la respuesta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 surveyId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       questions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             title:
 *                               type: string
 *                             answer:
 *                               type: object
 *                               nullable: true
 *                               properties:
 *                                 optionCodes:
 *                                   type: array
 *                                   items:
 *                                     type: integer
 *                                 textAnswer:
 *                                   type: string
 *                                 numericAnswer:
 *                                   type: number
 *       404:
 *         description: Respuesta no encontrada
 */

/**
 * @swagger
 * /response/survey/{id}:
 *   get:
 *     summary: Obtener todas las respuestas enviadas para una encuesta
 *     tags:
 *       - Response
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la encuesta
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de respuestas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   answers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         questionId:
 *                           type: integer
 *                         questionTitle:
 *                           type: string
 *                         optionCodes:
 *                           type: array
 *                           items:
 *                             type: integer
 *                         textAnswer:
 *                           type: string
 *                         numericAnswer:
 *                           type: number
 *                         sectionId:
 *                           type: integer
 *                         sectionTitle:
 *                           type: string
 *                         questionRequired:
 *                           type: boolean
 *       404:
 *         description: Encuesta no encontrada o sin respuestas
 */
