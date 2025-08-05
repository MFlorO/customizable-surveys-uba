import { PrismaClient, LogicAction, SurveyStatus } from '@prisma/client';
import { HttpError } from '../utils';

const prisma = new PrismaClient();

export const validateLogicConditionData = async (
  data: {
    questionId: number;
    triggerOptionId: number;
    action: LogicAction;
    targetQuestionId?: number | null;
    targetSectionId?: number | null;
  }
) => {
  const { questionId, triggerOptionId, action, targetQuestionId, targetSectionId } = data;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      section: {
        include: { survey: true },
      },
    },
  });

  if (!question) throw new HttpError('La pregunta indicada no existe.', 404);

  if (question.section.survey.status !== SurveyStatus.DRAFT) {
    throw new HttpError('Solo se puede modificar la lógica si la encuesta está en estado DRAFT.', 400);
  }

  const option = await prisma.option.findUnique({ where: { id: triggerOptionId } });

  if (!option) throw new HttpError('La opción disparadora no existe.', 404);

  if (option.questionId !== questionId) {
    throw new HttpError('La opción no pertenece a la pregunta indicada.', 400);
  }

  if ((action === LogicAction.ENABLE_QUESTION || action === LogicAction.DISABLE_QUESTION) && !targetQuestionId) {
    throw new HttpError('Debes proporcionar una pregunta objetivo para esta acción.', 400);
  }

  if ((action === LogicAction.ENABLE_QUESTION || action === LogicAction.DISABLE_QUESTION) && targetQuestionId) {
    const targetQuestion = await prisma.question.findUnique({ where: { id: targetQuestionId } });
    if (!targetQuestion) throw new HttpError('La pregunta objetivo no existe.', 404);
  }

  if (action === LogicAction.DISABLE_SECTION && !targetSectionId) {
    throw new HttpError('Debes proporcionar una sección objetivo para esta acción.', 400);
  }

  if (action === LogicAction.DISABLE_SECTION && targetSectionId) {
    const targetSection = await prisma.section.findUnique({ where: { id: targetSectionId } });
    if (!targetSection) throw new HttpError('La sección objetivo no existe.', 404);
  }
}
