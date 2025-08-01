import { PrismaClient, LogicAction } from '@prisma/client';
import { validateLogicConditionData } from '../validators/logicCondition.validatiors';

const prisma = new PrismaClient();

type LogicData = {
  id: number;
  questionId: number, 
  triggerOptionId: number, 
  action: LogicAction, 
  targetQuestionId?: number, 
  targetSectionId?: number
};

export class LogicConditionService {

  static async create(data: LogicData) {
    
    const { questionId, triggerOptionId, action, targetQuestionId, targetSectionId } = data;

    await validateLogicConditionData(data);

    return prisma.logicCondition.create({
      data: {
        questionId,
        triggerOptionId,
        action,
        targetQuestionId,
        targetSectionId,
      },
    });
  }

  static async getAll() {
    return prisma.logicCondition.findMany();
  }

  static async getById(id: number) {
    return prisma.logicCondition.findUnique({ where: { id } });
  }

  static async updateById( id: number, data: LogicData ) {

    const existingLogic = await prisma.logicCondition.findUnique({
      where: { id },
      include: {
        question: {
          include: {
            section: {
              include: { survey: true },
            },
          },
        },
      },
    });

    if (!existingLogic) throw new Error('La lógica condicional no existe.');

    if (existingLogic.question.section.survey.status !== 'DRAFT') {
      throw new Error('Solo se puede modificar la lógica si la encuesta está en estado DRAFT.');
    }

    await validateLogicConditionData(data);

    return prisma.logicCondition.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    const exists = await prisma.logicCondition.findUnique({ where: { id } });
    if (!exists) throw new Error('Lógica condicional no encontrada.');
    return prisma.logicCondition.delete({ where: { id } });
  }

}
