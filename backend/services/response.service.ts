import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResponseService {

  static async submitResponse(data: {
    surveyId: number;
    answers: {
      questionId: number;
      optionCodes?: number[];
      textAnswer?: string;
      numericAnswer?: number;
    }[];
  }) {
    const answers = await Promise.all(
      data.answers.map(async (answer) => {
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: {
            section: true,
            options: {
              include: {
                LogicCondition: true,
              },
            },
          },
        });

        if (!question) throw new Error(`Pregunta ${answer.questionId} no encontrada`);

        let logicApplied = false;
        let logicAction: "FINALIZE" | "DISABLE_QUESTION" | undefined = undefined;
        let logicTargetId: number | undefined = undefined;

        let selectedOptions = [];

        if (answer.optionCodes && answer.optionCodes.length > 0) {
          selectedOptions = question.options.filter((opt) =>answer.optionCodes!.includes(opt.code));

          // Procesar condiciones lógicas si hay
          const triggeredLogic = selectedOptions.flatMap((opt) => opt.LogicCondition);

          if (triggeredLogic.length > 0) {
            const firstLogic = triggeredLogic[0];
            logicApplied = true;
            logicAction = firstLogic.action;
            logicTargetId = firstLogic.targetQuestionId ?? undefined;
          }
        }

        return {
          questionId: answer.questionId,
          optionCodes: answer.optionCodes ?? [],
          textAnswer: answer.textAnswer,
          numericAnswer: answer.numericAnswer,
          questionTitle: question.title,
          sectionId: question.sectionId,
          sectionTitle: question.section.title,
          questionRequired: question.isRequired,
          logicApplied,
          logicAction,
          logicTargetId,
        };
      })
    );

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: data.surveyId,
        answers: {
          create: answers,
        },
      },
      include: {
        answers: true,
      },
    });

    return response;
  }

  static async getDetailedResponse(responseId: number) {
    const response = await prisma.surveyResponse.findUnique({
      where: { id: responseId },
      include: {
        survey: {
          include: {
            sections: {
              include: {
                questions: true,
              },
            },
          },
        },
        answers: true,
      },
    });

    if (!response) throw new Error('Respuesta no encontrada');

    const grouped = response.survey.sections.map((section) => ({
      id: section.id,
      title: section.title,
      questions: section.questions.map((question) => {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        return {
          id: question.id,
          title: question.title,
          answer: answer
            ? {
                optionCodes: answer.optionCodes,
                textAnswer: answer.textAnswer,
                numericAnswer: answer.numericAnswer,
              }
            : null,
        };
      }),
    }));

    return {
      id: response.id,
      surveyId: response.surveyId,
      createdAt: response.createdAt,
      sections: grouped,
    };
  }

  static async getAllBySurveyId(surveyId: number) {
    const responses = await prisma.surveyResponse.findMany({
      where: { surveyId },
      include: {
        answers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return responses.map((response) => ({
      id: response.id,
      createdAt: response.createdAt,
      answers: response.answers.map((a) => ({
        questionId: a.questionId,
        questionTitle: a.questionTitle,
        optionCodes: a.optionCodes,
        textAnswer: a.textAnswer,
        numericAnswer: a.numericAnswer,
        sectionId: a.sectionId,
        sectionTitle: a.sectionTitle,
        questionRequired: a.questionRequired,
      })),
    }));
  }
}
