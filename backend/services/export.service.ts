import ExcelJS from 'exceljs';
import { Option, SurveyResponseExport } from './survey.service';

export class ExportService {
    
  // Generar y guardar archivo Excel
  async exportResponsesToExcel(
    surveyTitle: string,
    responses: SurveyResponseExport[],
    questionOptionsMap: Record<number, Option[]>
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Respuestas');

    // Encabezados
    sheet.columns = [
      { header: 'ID Respuesta', key: 'responseId', width: 15 },
      { header: 'Sección', key: 'section', width: 30 },
      { header: 'Pregunta', key: 'question', width: 50 },
      { header: 'Respuesta (Código - Label)', key: 'answer', width: 50 },
    ];

    // Agregar filas con las respuestas
    for (const response of responses) {
      for (const answer of response.answers) {
        let answerText = '';

        if (answer.optionCodes.length > 0) {
          const options = questionOptionsMap[answer.questionId];
          if (options) {
            const labels = answer.optionCodes.map(code => {
              const option = options.find(o => o.code === code);
              return option ? `${code} - ${option.label}` : `${code}`;
            });
            answerText = labels.join(', ');
          } else {
            answerText = answer.optionCodes.join(', ');
          }
        } else if (answer.textAnswer) {
          answerText = answer.textAnswer;
        } else if (answer.numericAnswer !== null && answer.numericAnswer !== undefined) {
          answerText = answer.numericAnswer.toString();
        } else {
          answerText = 'Sin respuesta';
        }

        sheet.addRow({
          responseId: response.id,
          section: answer.sectionTitle,
          question: answer.questionTitle,
          answer: answerText,
        });
      }
    }

    // Devolver buffer para ser descargado o guardado
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
