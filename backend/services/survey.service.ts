import { PrismaClient, SurveyStatus, QuestionType, Prisma, LogicAction } from '@prisma/client';
const prisma = new PrismaClient();

type SurveyInput = {
  title: string;
  description?: string;
  status: SurveyStatus,
  isEnable: boolean;
  sections?: {
    title: string;
    order?: number;
    questions?: {
      title: string;
      description?: string;
      type: QuestionType;
      isRequired: boolean;
      characterLimit?: number;
      logicConditions?: {
        triggerOptionId: number;
        action: LogicAction;
        targetQuestionId?: number;
      }[];
      options?: {
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
            title: section.title,
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
        const createdSection = survey.sections[sectionIndex];

        for (const [questionIndex, questionInput] of (section.questions ?? []).entries()) {
          const createdQuestion = createdSection.questions[questionIndex];

          if (questionInput.logicConditions?.length) {
            for (const logic of questionInput.logicConditions) {

              const triggeredOption = createdQuestion.options.find((opt) => opt.code === logic.triggerOptionId);

              if (triggeredOption) {
                await prisma.logicCondition.create({
                  data: {
                    questionId: createdQuestion.id,
                    triggerOptionId: triggeredOption.id,
                    action: logic.action,
                    targetQuestionId: logic.targetQuestionId ?? null,
                  },
                });
              }
            }
          }
        }
      }


      // Luego consultas la encuesta con todo
      const surveyComplete = await prisma.survey.findUnique({
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


      return surveyComplete;
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

    if (!survey) throw new Error('Encuesta no encontrada');
    if (survey.status !== SurveyStatus.DRAFT) throw new Error('Solo se puede editar si está en estado DRAFT');

    // 1. Eliminar secciones asociadas (cascada borra preguntas y opciones)
    await prisma.section.deleteMany({ where: { surveyId: id } });

    // 2. Crear nuevo objeto con todo
    const prismaData: Prisma.SurveyUpdateInput = {
      title: data.title,
      description: data.description,
      status: data.status,
      isEnable: data.isEnable,
      sections: data.sections?.length
      ? {
          create: data.sections.map((section, index) => ({
            title: section.title,
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

    // 3. Actualizar encuesta con nuevas secciones
    return await prisma.survey.update({
      where: { id },
      data: prismaData,
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
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

    if (!survey) {
      throw new Error('Encuesta no encontrada');
    }

    await prisma.survey.delete({
      where: { id },
    });

    return {
      message: `Encuesta con ID ${id} eliminada correctamente`,
      data: survey,
    };
  }

  static async publish(id: number) {

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) throw new Error('Encuesta no encontrada');
    if (survey.status === SurveyStatus.PUBLISHED) throw new Error('La encuesta ya está publicada');

    return prisma.survey.update({
      where: { id },
      data: { status: SurveyStatus.PUBLISHED },
    });
  }

  static async enable(id: number, isEnable: boolean) {
    const survey = await prisma.survey.findUnique({ where: { id } });

    if (!survey) throw new Error('Encuesta no encontrada');

    if (survey.status !== SurveyStatus.PUBLISHED) {
      throw new Error('Solo se puede habilitar/deshabilitar si la encuesta está en estado PUBLISHED');
    }

    return prisma.survey.update({
      where: { id },
      data: { isEnable },
    });
  }

}
