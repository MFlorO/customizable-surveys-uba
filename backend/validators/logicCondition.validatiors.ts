import { PrismaClient, LogicAction } from '@prisma/client';

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

  if (!question) throw new Error('La pregunta indicada no existe.');

  if (question.section.survey.status !== 'DRAFT') {
    throw new Error('Solo se puede modificar la lógica si la encuesta está en estado DRAFT.');
  }

  const option = await prisma.option.findUnique({ where: { id: triggerOptionId } });

  if (!option) throw new Error('La opción disparadora no existe.');

  if (option.questionId !== questionId) {
    throw new Error('La opción no pertenece a la pregunta indicada.');
  }

  if ((action === 'ENABLE_QUESTION' || action === 'DISABLE_QUESTION') && !targetQuestionId) {
    throw new Error('Debes proporcionar una pregunta objetivo para esta acción.');
  }

  if ((action === 'ENABLE_QUESTION' || action === 'DISABLE_QUESTION') && targetQuestionId) {
    const targetQuestion = await prisma.question.findUnique({ where: { id: targetQuestionId } });
    if (!targetQuestion) throw new Error('La pregunta objetivo no existe.');
  }

  if (action === 'DISABLE_SECTION' && !targetSectionId) {
    throw new Error('Debes proporcionar una sección objetivo para esta acción.');
  }

  if (action === 'DISABLE_SECTION' && targetSectionId) {
    const targetSection = await prisma.section.findUnique({ where: { id: targetSectionId } });
    if (!targetSection) throw new Error('La sección objetivo no existe.');
  }
}
