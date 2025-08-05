import { Router } from 'express';
const router = Router();
const surveyRoutes = require('./survey.routes.ts');
const logicConditionRoutes = require('./logicCondition.routes');
const responseRoutes = require('./response.routes');

router.get('/', (req, res) => res.send('Bienvenido al backend de este proyecto!'));
router.use('/survey', surveyRoutes);
router.use('/logic-conditions', logicConditionRoutes);
router.use('/response', responseRoutes);

module.exports = router;

