const express = require('express');
const router = express.Router();
const surveyRoutes = require('./survey.routes');
const logicConditionRoutes = require('./logicCondition.routes');
const responseRoutes = require('./response.routes');

router.get('/', (req:any, res:any) => res.send('Bienvenido al backend de este proyecto!'));
router.use('/survey', surveyRoutes);
router.use('/logic-conditions', logicConditionRoutes);
router.use('/response', responseRoutes);

module.exports = router;

