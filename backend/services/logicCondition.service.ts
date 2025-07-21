import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class LogicConditionService {
  static async create(data: any) {
    return prisma.logicCondition.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.logicCondition.update({ where: { id }, data });
  }

  static async delete(id: number) {
    return prisma.logicCondition.delete({ where: { id } });
  }

  static async getById(id: number) {
    return prisma.logicCondition.findUnique({ where: { id } });
  }

  static async getByQuestion(questionId: number) {
    return prisma.logicCondition.findMany({ where: { questionId } });
  }
}

