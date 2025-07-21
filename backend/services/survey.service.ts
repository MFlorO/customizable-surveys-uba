import { PrismaClient, SurveyStatus, QuestionType, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

type SurveyInput = {
  title: string;
  description?: string;
  status: SurveyStatus,
  sections?: {
    title: string;
    order?: number;
    questions?: {
      title: string;
      description?: string;
      type: QuestionType;
      isRequired: boolean,
      characterLimit?: number,
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

      const prismaData: Prisma.SurveyCreateInput = {
        title: data.title,
        description: data.description,
        status: SurveyStatus.DRAFT,
        sections: data.sections && data.sections.length > 0
        ? {
            create: data.sections.map((section, index:number) => ({
              title: section.title,
              order: section.order ?? index, 
              questions: section.questions && section.questions.length > 0
              ? {
                  create: section.questions.map((q) => ({
                    title: q.title,
                    description: q.description,
                    type: q.type, 
                    options: q.options && q.options.length > 0
                    ? {
                        create: q.options.map((opt) => ({
                          label: opt.label,
                          code: opt.code,
                          isCustomText: opt.isCustomText
                        })),
                      }
                    : undefined,
                  })),
                }
              : undefined,
            })),
          }
        : undefined,
      };

      return await prisma.survey.create({
        data: prismaData,
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
      console.error('Error creando encuesta:', error);
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
                        code: opt.code
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

  static async publish(id: number) {

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) throw new Error('Encuesta no encontrada');
    if (survey.status === SurveyStatus.PUBLISHED) throw new Error('La encuesta ya está publicada');

    return prisma.survey.update({
      where: { id },
      data: { status: SurveyStatus.PUBLISHED },
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


}
