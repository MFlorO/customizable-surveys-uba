import { QuestionType } from '@prisma/client';
import { z } from 'zod';

export const createSurveySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      title: z.string().min(1, 'Título de la sección obligatorio'),
      questions: z.array(
        z.object({
          title: z.string().min(1, 'Título de la pregunta obligatorio'),
          type: z.nativeEnum(QuestionType),
          options: z.array(
            z.object({
              label: z.string().min(1, 'Label obligatorio'),
              code: z.number(),
            })
          )
          .optional()
          .default([]),
        })
      )
      .optional()
      .default([]),
    })
  )
  .optional()
  .default([]),
});

export const updateSurveySchema = createSurveySchema;
