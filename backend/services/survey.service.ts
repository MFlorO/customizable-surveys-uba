import { PrismaClient, SurveyStatus, QuestionType, Prisma, LogicAction } from '@prisma/client';
import { validateLogicConditionData } from '../validators/logicCondition.validatiors';
import { HttpError } from '../utils';
const prisma = new PrismaClient();

type SurveyInput = {
  title: string;
  description?: string;
  status: SurveyStatus,
  isEnable: boolean;
  sections?: {
    id: number;
    title?: string;
    order?: number;
    questions?: {
      id: number;
      title: string;
      description?: string;
      type: QuestionType;
      isRequired: boolean;
      characterLimit?: number;
      logicConditions?: {
        triggerOptionId: number;
        action: LogicAction;
        targetQuestionId?: number;
        targetSectionId?: number;
      }[];
      options?: {
        id: number;
        label: string;
        code: number;
        isCustomText: boolean;
      }[];
    }[];
  }[];
};

export class SurveyService {

  static async create(data: SurveyInput) {
    try {

      const sectionsInput = data.sections ?? [];

      const prismaData: Prisma.SurveyCreateInput = {
        title: data.title,
        description: data.description,
        status: SurveyStatus.DRAFT,
        isEnable: data.isEnable,
        sections: {
          create: sectionsInput.map((section, sectionIndex) => ({
            title: section.title ?? "",
            order: section.order ?? sectionIndex,
            questions: {
              create: !data.sections 
              ? [] 
              : (section.questions ?? []).map((q) => ({
                title: q.title,
                description: q.description,
                type: q.type,
                characterLimit: q.characterLimit ?? undefined,
                options: q.options?.length
                  ? {
                      create: q.options.map((opt) => ({
                        label: opt.label,
                        code: opt.code,
                        isCustomText: opt.isCustomText,
                      })),
                    }
                  : undefined,
                logicConditions: undefined, 
              }))
            }
          }))
        },
      };

      const survey = await prisma.survey.create({
        data: prismaData,
        include: {
          sections: {
            include: {
              questions: {
                include: { 
                  options: true,
                  logicConditions: true
                },
              },
            },
          },
        },
      });

      for (const [sectionIndex, section] of (data.sections ?? []).entries()) {
        const originalSection = survey.sections[sectionIndex];

        for (const [questionIndex, questionInput] of (section.questions ?? []).entries()) {
          const originalQuestion = originalSection.questions[questionIndex];

          if (questionInput.logicConditions?.length) {
            for (const logic of questionInput.logicConditions) {
              const triggeredOption = originalQuestion.options.find(opt => opt.id === logic.triggerOptionId); //TODO: OJO ! CODE?

              if (!triggeredOption) {
                throw new HttpError(`Opción no encontrada con código: ${logic.triggerOptionId}`, 400);
              }

              const targetQuestionIndex = logic.targetQuestionId != null
                ? section.questions?.findIndex(item => item.id === logic.targetQuestionId)
                : -1;

              const realTargetQuestionId =
                targetQuestionIndex !== -1 && targetQuestionIndex != null
                  ? originalSection.questions?.[targetQuestionIndex]?.id ?? null
                  : null;
              
              const targetSectionIndex = logic.targetSectionId != null
                ? data.sections?.findIndex(item => item.id === logic.targetSectionId)
                : -1;

              const realTargetSectionId =
                targetSectionIndex !== -1 && targetSectionIndex != null
                  ? survey.sections?.[targetSectionIndex]?.id ?? null
                  : null;

              const validationData = {
                questionId: originalQuestion.id,
                triggerOptionId: triggeredOption.id,
                action: logic.action,
                targetQuestionId: realTargetQuestionId,
                targetSectionId: realTargetSectionId,
              };

              await validateLogicConditionData(validationData);

              await prisma.logicCondition.create({ data: validationData });
            }
          }
        }
      }

      return await prisma.survey.findUnique({
        where: { id: survey.id },
        include: {
          sections: {
            include: {
              questions: {
                include: {
                  options: true,
                  logicConditions: true,
                },
              },
            },
          },
        },
      });

    } catch (error) {
      console.error("Error creando encuesta:", error);
      throw error;
    }
  }

  static async updateById(id: number, data: SurveyInput) {

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { sections: true }
    });

    if (!survey) throw new HttpError('Encuesta no encontrada', 404);
    if (survey.status !== SurveyStatus.DRAFT) {
      throw new HttpError('Solo se puede editar si está en estado DRAFT', 400);
    }

    await prisma.section.deleteMany({ where: { surveyId: id } });

    const prismaData: Prisma.SurveyUpdateInput = {
      title: data.title,
      description: data.description,
      status: data.status,
      isEnable: data.isEnable,
      sections: data.sections?.length
        ? {
            create: data.sections.map((section, index) => ({
              title: section.title ?? "",
              order: section.order ?? index,
              questions: section.questions?.length
                ? {
                    create: section.questions.map((q) => ({
                      title: q.title,
                      type: q.type,
                      isRequired: q.isRequired ?? true,
                      characterLimit: q.characterLimit,
                      options: q.options?.length
                        ? {
                            create: q.options.map((opt) => ({
                              label: opt.label,
                              code: opt.code,
                              isCustomText: opt.isCustomText,
                            }))
                          }
                        : undefined
                    }))
                  }
                : undefined
            }))
          }
        : undefined
    };

    await prisma.survey.update({
      where: { id },
      data: prismaData,
    });

    const updatedSurvey = await prisma.survey.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                logicConditions: true,
              }
            }
          }
        }
      }
    });

    if (!updatedSurvey) throw new HttpError('Error al recuperar la encuesta actualizada', 500);

    for (const [sectionIndex, section] of (data.sections ?? []).entries()) {

      const originalSection = updatedSurvey.sections[sectionIndex];

      for (const [questionIndex, questionInput] of (section.questions ?? []).entries()) {
        const originalQuestion = originalSection.questions[questionIndex];

        if (questionInput.logicConditions?.length) {
          for (const logic of questionInput.logicConditions) {

            const triggeredOptionIndex = questionInput?.options?.findIndex(opt => opt.id === logic.triggerOptionId);

            const realTriggeredOption = (triggeredOptionIndex !== -1 && triggeredOptionIndex !== undefined)
            ? originalQuestion?.options[triggeredOptionIndex]?.id ?? null
            : null;

            if (!realTriggeredOption) {
              throw new HttpError(`Opción no encontrada con código: ${logic.triggerOptionId}`, 400);
            }

            const targetQuestionIndex = logic.targetQuestionId != null
            ? section.questions?.findIndex(item => item.id === logic.targetQuestionId)
            : -1;

            const realTargetQuestionId = targetQuestionIndex !== -1 && targetQuestionIndex != null
            ? originalSection.questions?.[targetQuestionIndex]?.id ?? null
            : null;

            const targetSectionIndex = logic.targetSectionId != null
            ? data.sections?.findIndex(item => item.id === logic.targetSectionId)
            : -1;

            const realTargetSectionId = targetSectionIndex !== -1 && targetSectionIndex != null
            ? updatedSurvey.sections?.[targetSectionIndex]?.id ?? null
            : null;

            const validationData = {
              questionId: originalQuestion.id,
              triggerOptionId: realTriggeredOption,
              action: logic.action,
              targetQuestionId: realTargetQuestionId,
              targetSectionId: realTargetSectionId,
            };

            await validateLogicConditionData(validationData);

            await prisma.logicCondition.create({ data: validationData });
          }
        }
      }
    }

    return await prisma.survey.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                logicConditions: true,
              },
            },
          },
        },
      },
    });
  }

  static async getAll() {
    return prisma.survey.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                logicConditions: true,
              },
            },
          },
        },
      },
    });
  }

  static async getById(id: number) {
    return prisma.survey.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                logicConditions: true,
              },
            },
          },
        },
      },
    });
  }

  static async deleteById(id: number) {

    if (!id || isNaN(id) || id <= 0) {
      throw new Error('ID inválido');
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                logicConditions: true,
              },
            },
          },
        },
      },
    });

    if (!survey) throw new HttpError('Encuesta no encontrada', 404);

    await prisma.survey.delete({ where: { id } });

    return {
      message: `Encuesta con ID ${id} eliminada correctamente`,
      data: survey,
    };
  }

  static async publish(id: number) {

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) throw new HttpError('Encuesta no encontrada', 404);
    if (survey.status === SurveyStatus.PUBLISHED) throw new HttpError('La encuesta ya está publicada', 400);

    return prisma.survey.update({
      where: { id },
      data: { status: SurveyStatus.PUBLISHED },
    });
  }

  static async enable(id: number, isEnable: boolean) {
    const survey = await prisma.survey.findUnique({ where: { id } });

    if (!survey) throw new HttpError('Encuesta no encontrada',404);

    if (survey.status !== SurveyStatus.PUBLISHED) {
      throw new HttpError('Solo se puede habilitar/deshabilitar si la encuesta está en estado PUBLISHED',400);
    }

    return prisma.survey.update({
      where: { id },
      data: { isEnable },
    });
  }

}
