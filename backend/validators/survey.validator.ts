import { QuestionType } from '@prisma/client';
import { z } from 'zod';

export const createSurveySchema = z.object({
  title: z.string().min(1, 'El título de la encuesta es obligatorio'),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      title: z.string().optional().default(''),
      questions: z.array(
        z.object({
          title: z.string().min(1, 'El título de la pregunta es obligatorio'),
          type: z.nativeEnum(QuestionType),
          options: z.array(
            z.object({
              label: z.string().min(1, 'El label de la opción es obligatorio'),
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
