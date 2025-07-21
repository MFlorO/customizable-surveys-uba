import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Borrar todo antes de sembrar
  await prisma.answer.deleteMany({});
  await prisma.surveyResponse.deleteMany({});
  await prisma.logicCondition.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.survey.deleteMany({});

  // Crear encuesta
  const survey = await prisma.survey.create({
    data: {
      title: '3ra Encuesta a estudiantes',
      description: 'Desde la UBA estamos interesados en conocer las experiencias de aprendizaje de las y los estudiantes de la Universidad de Buenos Aires durante el primer cuatrimestre de 2025',
      status: 'DRAFT',
    },
  });

  // #####################
  // Sección 1
  const sectionSociodemo = await prisma.section.create({
    data: {
      title: 'I. ASPECTOS SOCIODEMOGRÁFICOS Y LABORALES',
      order: 1,
      surveyId: survey.id,
    },
  });

  const genero = await prisma.question.create({
    data: {
      title: '1. Género',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionSociodemo.id,
      options: {
        create: [
          { label: 'Masculino', code: 1 },
          { label: 'Femenino', code: 2 },
          { label: 'Otros', code: 3 },
          { label: 'Prefiero no decirlo', code: 4 },
        ],
      },
    },
    include: { options: true },
  });

  const edad = await prisma.question.create({
    data: {
      title: '2. Edad',
      description: '(número exacto de 2 cifras)',
      type: 'NUMBER',
      isRequired: true,
      characterLimit: 2,
      sectionId: sectionSociodemo.id,
    },
  });

  const provincia = await prisma.question.create({
    data: {
      title: '3. Provincia de residencia actual',
      description: '(seleccione de la lista)',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionSociodemo.id,
      options: {
        create: [
          { label: 'Buenos Aires', code: 1 },
          { label: 'CABA', code: 2 },
          { label: 'Catamarca', code: 3 },
          { label: 'Chaco', code: 4 },
          { label: 'Chubut', code: 5 },
          { label: 'Córdoba', code: 6 },
          { label: 'Corrientes', code: 7 },
          { label: 'Entre Ríos', code: 8 },
          { label: 'Formosa', code: 9 },
          { label: 'Jujuy', code: 10 },
          { label: 'La Pampa', code: 11 },
          { label: 'La Rioja', code: 12 },
          { label: 'Mendoza', code: 13 },
          { label: 'Misiones', code: 14 },
          { label: 'Neuquén', code: 15 },
          { label: 'Río Negro', code: 16 },
          { label: 'Salta', code: 17 },
          { label: 'San Juan', code: 18 },
          { label: 'San Luis', code: 19 },
          { label: 'Santa Cruz', code: 20 },
          { label: 'Santa Fe', code: 21 },
          { label: 'Santiago del Estero', code: 22 },
          { label: 'Tierra del Fuego', code: 23 },
          { label: 'Tucumán', code: 24 },
        ],
      },
    },
  });

  const localidad = await prisma.question.create({
    data: {
      title: '4. Localidad de residencia actual',
      type: 'TEXT',
      isRequired: true,
      sectionId: sectionSociodemo.id,
    },
  });

  const menoresCargo = await prisma.question.create({
    data: {
      title: '5. ¿Tiene hijos/as o menores a cargo?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionSociodemo.id,
      options: {
        create: [
          { label: 'No tengo', code: 1 },
          { label: 'Uno/a', code: 2 },
          { label: 'Dos', code: 3 },
          { label: 'Tres o más', code: 4 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const trabajo = await prisma.question.create({
    data: {
      title: '6. ¿Actualmente trabaja? ¿Cuántas horas semanales?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionSociodemo.id,
      options: {
        create: [
          { label: 'No trabajo', code: 1 },
          { label: 'Sí, trabajo entre 1 y 10 horas semanales', code: 2 },
          { label: 'Sí, trabajo entre 11 y 20 horas semanales', code: 3 },
          { label: 'Sí, trabajo entre 21 y 30 horas semanales', code: 4 },
          { label: 'Sí, trabajo entre 31 y 40 horas semanales', code: 5 },
          { label: 'Sí, trabajo 41 horas o más', code: 6 },
          { label: 'No trabajo pero busco trabajo', code: 7 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });


  // #####################
  // Sección 2

  const sectionEducativos = await prisma.section.create({
    data: {
      title: 'II. ASPECTOS EDUCATIVOS',
      order: 2,
      surveyId: survey.id,
    },
  });

  const facultad = await prisma.question.create({
    data: {
      title: '7. ¿En cuál facultad de la UBA estudia actualmente?',
      description: 'Si estudia en más de una facultad, responda por la carrera en la que se encuentre más avanzado. Si está en el CBC, indique la Facultad de su carrera.',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEducativos.id,
      options: {
        create: [
          { label: 'Facultad de Agronomía', code: 1 },
          { label: 'Facultad de Arquitectura, Diseño y Urbanismo', code: 2 },
          { label: 'Facultad de Ciencias Económicas', code: 3 },
          { label: 'Facultad de Ciencias Exactas y Naturales', code: 4 },
          { label: 'Facultad de Ciencias Sociales', code: 5 },
          { label: 'Facultad de Ciencias Veterinarias', code: 6 },
          { label: 'Facultad de Derecho', code: 7 },
          { label: 'Facultad de Farmacia y Bioquímica', code: 8 },
          { label: 'Facultad de Filosofía y Letras', code: 9 },
          { label: 'Facultad de Ingeniería', code: 10 },
          { label: 'Facultad de Medicina', code: 11 },
          { label: 'Facultad de Odontología', code: 12 },
          { label: 'Facultad de Psicología', code: 13 },
          { label: 'Rectorado', code: 14 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const carrera = await prisma.question.create({
    data: {
      title:'8. ¿En cuál carrera se encuentra inscripto? (Responda por la que se encuentre más avanzado)',
      type: 'TEXT',
      isRequired: true,
      sectionId: sectionEducativos.id,
    },
  });

  const anioCbc = await prisma.question.create({
    data: {
      title: '9. ¿En qué año se inscribió al CBC?',
      description: 'Responda por la carrera donde se encuentre más avanzado',
      type: 'TEXT',
      isRequired: true,
      sectionId: sectionEducativos.id
    },
  });

  const etapaCarrera = await prisma.question.create({
    data: {
      title:'10. ¿En qué etapa de su carrera (expresada en años) se encuentra actualmente?. (Si estudia más de una carrera, responda por la que se encuentre más avanzado en sus estudios).',
      description: 'Seleccione el año que está cursando (1, 2, 3, etc.)',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEducativos.id,
      options: {
        create: Array.from({ length: 8 }).map((_, i) => {
          const year = i + 1;
          return {
            label: `${year}° año`,
            code: year,
          };
        }),
      },
    },
  });



  // #####################
  // Sección 3

  const sectionEntornoVirtual = await prisma.section.create({
    data: {
      title: 'III. CONDICIONES PARA EL ESTUDIO EN ENTORNOS VIRTUALES',
      order: 3,
      surveyId: survey.id,
    },
  });

  const conectividad = await prisma.question.create({
    data: {
      title: '11. ¿Mediante qué servicio se conecta principalmente a internet?',
      type: 'SELECT_MULTIPLE',
      isRequired: true,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Conexión de banda ancha propia', code: 1 },
          { label: 'Conexión compartida', code: 2 },
          { label: 'Conectividad móvil', code: 3 },
          { label: 'Otro', code: 4, isCustomText: true },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const dispositivosInternet = await prisma.question.create({
    data: {
      title: '12. ¿A través de cuáles dispositivos se conecta a internet?',
      type: 'SELECT_MULTIPLE',
      isRequired: true,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Computadora de escritorio', code: 1 },
          { label: 'Notebook y/o Netbook', code: 2 },
          { label: 'Tablet', code: 3 },
          { label: 'Teléfono celular', code: 4 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const dispositivoPreferido = await prisma.question.create({
    data: {
      title: '13. ¿Cuál de los siguientes dispositivos utiliza preferentemente para estudiar?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Computadora de uso personal exclusivo', code: 1 },
          { label: 'Computadora de uso compartido', code: 2 },
          { label: 'Computadora del lugar de trabajo', code: 3 },
          { label: 'Teléfono móvil (Smartphone)', code: 4 },
          { label: 'Otros', code: 5, isCustomText: true },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const herramientasDigitales = await prisma.question.create({
    data: {
      title: '14. ¿Cuáles herramientas digitales utiliza para estudiar?',
      type: 'SELECT_MULTIPLE',
      isRequired: true,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Videoconferencia (Zoom, Meet, etc.)', code: 1 },
          { label: 'Campus virtual / entorno institucional', code: 2 },
          { label: 'Correctores ortográficos', code: 3 },
          { label: 'Herramientas de IA generativa', code: 4 },
          { label: 'Aplicaciones de organización', code: 5 },
          { label: 'Ninguna de las anteriores', code: 6 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const iaProposito = await prisma.question.create({
    data: {
      title: '15. ¿Con qué propósito utilizó herramientas de IA generativa?',
      type: 'SELECT_MULTIPLE',
      isRequired: false,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Explicación de conceptos', code: 1 },
          { label: 'Resúmenes de textos', code: 2 },
          { label: 'Generación de ideas', code: 3 },
          { label: 'Redacción de textos', code: 4 },
          { label: 'Corrección o edición', code: 5 },
          { label: 'Bibliografía o referencias', code: 6 },
          { label: 'Ninguna de las anteriores', code: 7 },
          { label: 'No utilizó herramientas de IA', code: 8 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const iaMotivo = await prisma.question.create({
    data: {
      title: '16. ¿Cuáles son los motivos por los que usa IA generativa?',
      type: 'SELECT_MULTIPLE',
      isRequired: false,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Ahorrar tiempo', code: 1 },
          { label: 'Mejorar la calidad', code: 2 },
          { label: 'Ayuda personalizada', code: 3 },
          { label: 'Comprender contenidos', code: 4 },
          { label: 'Apoyo fuera del horario de clase', code: 5 },
          { label: 'Ninguna de las anteriores', code: 6 },
          { label: 'No utilizó IA generativa', code: 7 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const recursosDeseados = await prisma.question.create({
    data: {
      title: '17. ¿Qué apoyos le gustaría recibir de la UBA sobre herramientas digitales?',
      type: 'SELECT_MULTIPLE',
      isRequired: false,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Cursos sobre IA', code: 1 },
          { label: 'Asesoramiento personalizado', code: 2 },
          { label: 'Guías de uso', code: 3 },
          { label: 'Acceso a plataformas institucionales', code: 4 },
          { label: 'Ninguna de las anteriores', code: 5 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const espacioEstudio = await prisma.question.create({
    data: {
      title: '18. ¿Con cuáles recursos cuenta en su ambiente para estudiar?',
      type: 'SELECT_MULTIPLE',
      isRequired: false,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Un escritorio para estudiar', code: 1 },
          { label: 'Una habitación propia', code: 2 },
          { label: 'Un lugar silencioso', code: 3 },
          { label: 'Una biblioteca', code: 4 },
          { label: 'Ninguna de las anteriores', code: 5 },
        ],
      },
    },
  });

  const evaluacionAmbiente = await prisma.question.create({
    data: {
      title: '19. ¿Cómo evalúa el ambiente que usa para cursadas virtuales?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEntornoVirtual.id,
      options: {
        create: [
          { label: 'Muy adecuado', code: 1 },
          { label: 'Adecuado', code: 2 },
          { label: 'Ni adecuado / Ni inadecuado', code: 3 },
          { label: 'Inadecuado', code: 4 },
          { label: 'Muy inadecuado', code: 5 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });



  // #####################
  // Sección 4

  const sectionEvaluacion = await prisma.section.create({
    data: {
      title: 'IV. LA EVALUACIÓN DE SU EXPERIENCIA COMO ESTUDIANTE DE LA UBA',
      order: 4,
      surveyId: survey.id,
    },
  });

  const p20 = await prisma.question.create({
    data: {
      title: '20. ¿Actualmente, durante el 1° cuatrimestre de 2025, está cursando alguna materia?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEvaluacion.id,
      options: {
        create: [
          { label: 'Sí', code: 1 },
          { label: 'No', code: 2 }, //! FINALIZAR LA ENCUESTA PARA QUIENES RESPONDIERON QUE NO CURSAN MATERIAS 
        ],
      },
    },
    include: { options: true },
  });

  // Condición lógica para finalizar si responde "No" (code: 2)
  const opcionNoCursa = p20.options.find(opt => opt.code === 2);
  if (opcionNoCursa) {
    await prisma.logicCondition.create({
      data: {
        questionId: p20.id,
        triggerOptionId: opcionNoCursa.id,
        action: 'FINALIZE',
      },
    });
  }

  const p21 = await prisma.question.create({
    data: {
      title: '21. ¿Cuántas materias está cursando actualmente?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEvaluacion.id,
      options: {
        create: [
          { label: 'Una', code: 1 },
          { label: 'Dos', code: 2 },
          { label: 'Tres', code: 3 },
          { label: 'Cuatro', code: 4 },
          { label: 'Cinco', code: 5 },
          { label: 'Seis o más', code: 6 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const p22 = await prisma.question.create({
    data: {
      title: '22. ¿Alguna de las materias que actualmente cursa se dictan de forma 100% virtual?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEvaluacion.id,
      options: {
        create: [
          { label: 'Sí, algunas', code: 1 },
          { label: 'Sí, todas', code: 2 },
          { label: 'No, todas son presenciales o semipresenciales', code: 3 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const p23 = await prisma.question.create({
    data: {
      title: '23. ¿Alguna materia que cursa se dicta de forma semipresencial?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEvaluacion.id,
      options: {
        create: [
          { label: 'Sí, algunas', code: 1 },
          { label: 'Sí, todas', code: 2 },
          { label: 'No, ninguna', code: 3 },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });
  
  // Condición lógica para deshabilitarla pregunta 23 si responde "sí, todas" (code: 2) en la pregunta 22
  const opcionTodasVirtuales = (await prisma.option.findFirst({
    where: {
      questionId: p22.id,
      code: 2, // "Sí, todas"
    },
  }));

  if (opcionTodasVirtuales) {
    await prisma.logicCondition.create({
      data: {
        questionId: p22.id,
        triggerOptionId: opcionTodasVirtuales.id,
        action: 'DISABLE_QUESTION',
        targetQuestionId: p23.id,
      },
    });
  }
  
  const p24: Record<string, any> = {};

  const enunciados24 = [
    'a. La posibilidad de asistir presencialmente a clases me brinda mayores oportunidades para interactuar y participar con mis compañeros y docentes.',
    'b. Durante las clases presenciales suelo sostener mayores niveles de atención a las explicaciones de mis docentes.',
    'c. Durante las clases presenciales tengo mayores oportunidades de hacer consultas y recibir devoluciones.',
    'd. Durante las clases presenciales tengo mayores oportunidades de hacer actividades grupales.',
  ];

  for (const [index, text] of enunciados24.entries()) {
    const letra = String.fromCharCode(97 + index)
    const pregunta = await prisma.question.create({
      data: {
        title: `24${String.fromCharCode(97 + index)} ${text}`,
        type: 'SELECT_ONE',
        isRequired: true,
        sectionId: sectionEvaluacion.id,
        options: {
          create: [
            { label: 'Muy de acuerdo', code: 1 },
            { label: 'De acuerdo', code: 2 },
            { label: 'No hay diferencias significativas', code: 3 },
            { label: 'En desacuerdo', code: 4 },
            { label: 'Muy en desacuerdo', code: 5 },
            { label: 'Ns/Nc', code: 99 },
          ],
        },
      },
    });

    p24[`p24${letra}`] = pregunta;
  }


  const p25: Record<string, any> = {};

  const enunciados25 = [
    'a. Las clases virtuales me permiten combinar mejor mi tiempo de estudio con mis responsabilidades.',
    'b. La posibilidad de que las clases virtuales sean grabadas me ayuda a revisar y comprender mejor.',
  ];

  for (const [index, text] of enunciados25.entries()) {
    const letra = String.fromCharCode(97 + index);
    const pregunta =await prisma.question.create({
      data: {
        title: `25${String.fromCharCode(97 + index)} ${text}`,
        type: 'SELECT_ONE',
        isRequired: true,
        sectionId: sectionEvaluacion.id,
        options: {
          create: [
            { label: 'Muy de acuerdo', code: 1 },
            { label: 'De acuerdo', code: 2 },
            { label: 'Ni acuerdo ni desacuerdo', code: 3 },
            { label: 'En desacuerdo', code: 4 },
            { label: 'Muy en desacuerdo', code: 5 },
            { label: 'Ns/Nc', code: 99 },
          ],
        },
      },
    });
    p25[`p25${letra}`] = pregunta;
  }

    
  const p26 = await prisma.question.create({
    data: {
      title: '26. ¿Cuál es su preferencia de modalidad de cursada?',
      type: 'SELECT_ONE',
      isRequired: true,
      sectionId: sectionEvaluacion.id,
      options: {
        create: [
          { label: 'Prefiero cursadas 100% presenciales', code: 1 },
          {
            label: 'Prefiero cursadas semipresenciales (algunas clases presenciales, otras virtuales)',
            code: 2,
          },
          {
            label: 'Prefiero cursadas 100% virtuales (todas las clases por Zoom, Meet, etc.)',
            code: 3,
          },
          { label: 'Ns/Nc', code: 99 },
        ],
      },
    },
  });

  const p27 = await prisma.question.create({
    data: {
      title: '27. ¿Por qué o por cuáles motivos prefiere la modalidad que eligió?',
      type: 'TEXT',
      isRequired: false,
      sectionId: sectionEvaluacion.id,
    },
  });
    

  console.log('✅ Base de datos limpiada y sembrada con lógica condicional');

  // Crear una respuesta para la encuesta usando los IDs reales
  const response = await prisma.surveyResponse.create({
    data: {
      surveyId: survey.id,
      answers: {
        create: [
          // I. Aspectos sociodemográficos
          {
            questionId: genero.id,
            questionTitle: genero.title,
            optionCodes: [2], // Femenino
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: genero.isRequired,
          },
          {
            questionId: edad.id,
            questionTitle: edad.title,
            numericAnswer: 22,
            optionCodes: [],
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: edad.isRequired,
          },
          {
            questionId: provincia.id,
            questionTitle: provincia.title,
            optionCodes: [1], // Ciudad Autónoma de Buenos Aires
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: provincia.isRequired,
          },
          {
            questionId: localidad.id,
            questionTitle: localidad.title,
            textAnswer: 'Palermo',
            optionCodes: [],
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: localidad.isRequired,
          },
          {
            questionId: menoresCargo.id,
            questionTitle: menoresCargo.title,
            optionCodes: [1],
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: menoresCargo.isRequired,
          },
          {
            questionId: trabajo.id,
            questionTitle: trabajo.title,
            optionCodes: [3],
            sectionId: sectionSociodemo.id,
            sectionTitle: sectionSociodemo.title,
            questionRequired: trabajo.isRequired,
          },

          // II. Aspectos educativos
          {
            questionId: facultad.id,
            questionTitle: facultad.title,
            optionCodes: [13], // Psicología
            sectionId: sectionEducativos.id,
            sectionTitle: sectionEducativos.title,
            questionRequired: facultad.isRequired,
          },
          {
            questionId: carrera.id,
            questionTitle: carrera.title,
            textAnswer: 'Lic. en Psicología',
            optionCodes: [],
            sectionId: sectionEducativos.id,
            sectionTitle: sectionEducativos.title,
            questionRequired: carrera.isRequired,
          },
          {
            questionId: anioCbc.id,
            questionTitle: anioCbc.title,
            optionCodes: [2022],
            sectionId: sectionEducativos.id,
            sectionTitle: sectionEducativos.title,
            questionRequired: anioCbc.isRequired,
          },
          {
            questionId: etapaCarrera.id,
            questionTitle: etapaCarrera.title,
            optionCodes: [3],
            sectionId: sectionEducativos.id,
            sectionTitle: sectionEducativos.title,
            questionRequired: etapaCarrera.isRequired,
          },

          // III. Condiciones para el estudio
          {
            questionId: conectividad.id,
            questionTitle: conectividad.title,
            optionCodes: [1, 3], // Banda ancha + móvil
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: conectividad.isRequired,
          },
          {
            questionId: dispositivosInternet.id,
            questionTitle: dispositivosInternet.title,
            optionCodes: [2, 4],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: dispositivosInternet.isRequired,
          },
          {
            questionId: dispositivoPreferido.id,
            questionTitle: dispositivoPreferido.title,
            optionCodes: [4],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: dispositivoPreferido.isRequired,
          },
          {
            questionId: herramientasDigitales.id,
            questionTitle: herramientasDigitales.title,
            optionCodes: [1, 2, 4, 5],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: herramientasDigitales.isRequired,
          },
          {
            questionId: iaProposito.id,
            questionTitle: iaProposito.title,
            optionCodes: [1, 2, 4],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: iaProposito.isRequired,
          },
          {
            questionId: iaMotivo.id,
            questionTitle: iaMotivo.title,
            optionCodes: [1, 2, 3],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: iaMotivo.isRequired,
          },
          {
            questionId: recursosDeseados.id,
            questionTitle: recursosDeseados.title,
            optionCodes: [1, 3],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: recursosDeseados.isRequired,
          },
          {
            questionId: espacioEstudio.id,
            questionTitle: espacioEstudio.title,
            optionCodes: [1, 2, 3],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: espacioEstudio.isRequired,
          },
          {
            questionId: evaluacionAmbiente.id,
            questionTitle: evaluacionAmbiente.title,
            optionCodes: [2],
            sectionId: sectionEntornoVirtual.id,
            sectionTitle: sectionEntornoVirtual.title,
            questionRequired: evaluacionAmbiente.isRequired,
          },

          // IV. Evaluación de experiencia UBA
          {
            questionId: p20.id,
            questionTitle: p20.title,
            optionCodes: [1], // Sí
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p20.isRequired,
            logicApplied: false
          },
          {
            questionId: p21.id,
            questionTitle: p21.title,
            optionCodes: [3], // Tres materias
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p21.isRequired,
          },
          {
            questionId: p22.id,
            questionTitle: p22.title,
            optionCodes: [1], // Algunas virtuales
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p22.isRequired,
          },
          {
            questionId: p23.id,
            questionTitle: p23.title,
            optionCodes: [2], // Todas semipresenciales
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p23.isRequired,
          },
          {
            questionId: p24.p24a.id,
            questionTitle: p24.p24a.title,
            optionCodes: [1],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p24.p24a.isRequired,
          },
          {
            questionId: p24.p24b.id,
            questionTitle: p24.p24b.title,
            optionCodes: [2],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p24.p24b.isRequired,
          },
          {
            questionId: p24.p24c.id,
            questionTitle: p24.p24c.title,
            optionCodes: [2],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p24.p24c.isRequired,
          },
          {
            questionId: p24.p24d.id,
            questionTitle: p24.p24d.title,
            optionCodes: [3],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p24.p24d.isRequired,
          },
          {
            questionId: p25.p25a.id,
            questionTitle: p25.p25a.title,
            optionCodes: [1],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p25.p25a.isRequired,
          },
          {
            questionId: p25.p25b.id,
            questionTitle: p25.p25b.title,
            optionCodes: [1],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p25.p25b.isRequired,
          },
          {
            questionId: p26.id,
            questionTitle: p26.title,
            optionCodes: [2], // Semipresencial
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p26.isRequired,
          },
          {
            questionId: p27.id,
            questionTitle: p27.title,
            textAnswer: 'Porque puedo organizarme mejor entre trabajo y estudio.',
            optionCodes: [],
            sectionId: sectionEvaluacion.id,
            sectionTitle: sectionEvaluacion.title,
            questionRequired: p27.isRequired,
          },
        ],
      },
    },
    include: {
      answers: true,
    },
  });

  console.log('✅ Se creó la respuesta completa para la encuesta.');

}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});

























// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {

//   // Borrar todo antes de sembrar
//   await prisma.answer.deleteMany({});
//   await prisma.surveyResponse.deleteMany({});
//   await prisma.logicCondition.deleteMany({});
//   await prisma.option.deleteMany({});
//   await prisma.question.deleteMany({});
//   await prisma.section.deleteMany({});
//   await prisma.survey.deleteMany({});

//   // Crear encuesta
//   const survey = await prisma.survey.create({
//     data: {
//       title: '3ra Encuesta a estudiantes',
//       description: 'Desde la UBA estamos interesados en conocer las experiencias de aprendizaje de las y los estudiantes de la Universidad de Buenos Aires durante el primer cuatrimestre de 2025',
//       status: 'DRAFT',
//     },
//   });

//   // Sección 1
//   const section1 = await prisma.section.create({
//     data: {
//       title: 'Sección 1 - Datos personales',
//       order: 1,
//       surveyId: survey.id,
//     },
//   });

//   // Preguntas en sección 1
//   const q1 = await prisma.question.create({
//     data: {
//       title: '¿Cuál es tu nombre?',
//       description: 'Nombre completo',
//       type: 'TEXT',
//       isRequired: true,
//       sectionId: section1.id,
//     },
//   });

//   const q2 = await prisma.question.create({
//     data: {
//       title: '¿Cuál es tu género?',
//       description: 'Seleccioná una opción',
//       type: 'SELECT_ONE',
//       isRequired: true,
//       sectionId: section1.id,
//       options: {
//         create: [
//           { label: 'Masculino', code: 1 },
//           { label: 'Femenino', code: 2 },
//           { label: 'Otro', code: 3 },
//         ],
//       },
//     },
//     include: { options: true },
//   });

//   const dispositivosQuestion = await prisma.question.create({
//     data: {
//       title: '¿Qué dispositivos usás para estudiar?',
//       type: 'SELECT_MULTIPLE',
//       isRequired: true,
//       sectionId: section1.id,
//       options: {
//         create: [
//           { label: 'Notebook', code: 1 },
//           { label: 'Celular', code: 2 },
//           { label: 'Tablet', code: 3 },
//           { label: 'PC de escritorio', code: 4 },
//         ],
//       },
//     },
//     include: { options: true },
//   });

//   // Sección 2
//   const section2 = await prisma.section.create({
//     data: {
//       title: 'Sección 2 - Tecnología y aprendizaje',
//       order: 2,
//       surveyId: survey.id,
//     },
//   });

//   const q5 = await prisma.question.create({
//     data: {
//       title: '¿Qué carrera estudiás?',
//       description: 'Texto con máximo 100 caracteres',
//       type: 'TEXT_LIMITED',
//       characterLimit: 100,
//       isRequired: true,
//       sectionId: section2.id,
//     },
//   });

//   const q6 = await prisma.question.create({
//     data: {
//       title: '¿Cuántas horas por día dedicás al estudio?',
//       type: 'NUMBER',
//       isRequired: true,
//       sectionId: section2.id,
//     },
//   });

//   const digitalToolQuestion = await prisma.question.create({
//     data: {
//       title: '¿Qué herramienta digital usás más frecuentemente?',
//       type: 'SELECT_ONE',
//       isRequired: true,
//       sectionId: section2.id,
//       options: {
//         create: [
//           { label: 'Zoom', code: 1 },
//           { label: 'Meet', code: 2 },
//           { label: 'Teams', code: 3 },
//           { label: 'Otra', code: 99, isCustomText: true },
//         ],
//       },
//     },
//     include: { options: true },
//   });

//   const organizacionQuestion = await prisma.question.create({
//     data: {
//       title: '¿Qué herramientas utilizás para organizar tus estudios?',
//       type: 'SELECT_MULTIPLE',
//       isRequired: false,
//       sectionId: section2.id,
//       options: {
//         create: [
//           { label: 'Trello', code: 1 },
//           { label: 'Notion', code: 2 },
//           { label: 'Google Calendar', code: 3 },
//           { label: 'Agenda en papel', code: 4 },
//         ],
//       },
//     },
//   });

//   // Lógica condicional
//   const otraOption = digitalToolQuestion.options.find(opt => opt.code === 99);
//   if (otraOption) {
//     await prisma.logicCondition.create({
//       data: {
//         questionId: digitalToolQuestion.id,
//         triggerOptionId: otraOption.id,
//         action: 'FINALIZE',
//       },
//     });
//   }

//   const pcOption = dispositivosQuestion.options.find(opt => opt.label === 'PC de escritorio');
//   if (pcOption) {
//     await prisma.logicCondition.create({
//       data: {
//         questionId: dispositivosQuestion.id,
//         triggerOptionId: pcOption.id,
//         action: 'DISABLE_QUESTION',
//         targetQuestionId: organizacionQuestion.id,
//       },
//     });
//   }

//   console.log('✅ Base de datos limpiada y sembrada con lógica condicional');

//   // Crear una respuesta para la encuesta usando los IDs reales
//   const response = await prisma.surveyResponse.create({
//     data: {
//       surveyId: survey.id,
//       answers: {
//         create: [
//           {
//             questionId: q1.id,
//             questionTitle: q1.title,
//             textAnswer: 'Florencia',
//             optionCodes: [],
//             numericAnswer: null,
//             sectionId: section1.id,
//             sectionTitle: section1.title,
//             questionRequired: q1.isRequired,
//           },
//           {
//             questionId: q2.id,
//             questionTitle: q2.title,
//             optionCodes: [2], // Femenino
//             sectionId: section1.id,
//             sectionTitle: section1.title,
//             questionRequired: q2.isRequired,
//           },
//           {
//             questionId: dispositivosQuestion.id,
//             questionTitle: dispositivosQuestion.title,
//             optionCodes: [1, 2], // Notebook y Celular
//             sectionId: section1.id,
//             sectionTitle: section1.title,
//             questionRequired: dispositivosQuestion.isRequired,
//           },
//           {
//             questionId: q5.id,
//             textAnswer: 'Licenciatura en Psicología',
//             optionCodes: [],
//             numericAnswer: null,
//             sectionId: section2.id,
//             sectionTitle: section2.title,
//             questionRequired: q5.isRequired,
//           },
//           {
//             questionId: q6.id,
//             numericAnswer: 5,
//             optionCodes: [],
//             sectionId: section2.id,
//             sectionTitle: section2.title,
//             questionRequired: q6.isRequired,
//           },
//           {
//             questionId: digitalToolQuestion.id,
//             optionCodes: [99], // Otra
//             textAnswer: 'Discord',
//             sectionId: section2.id,
//             sectionTitle: section2.title,
//             questionRequired: digitalToolQuestion.isRequired,
//           },
//           {
//             questionId: organizacionQuestion.id,
//             optionCodes: [2, 3], // Notion y Google Calendar
//             sectionId: section2.id,
//             sectionTitle: section2.title,
//             questionRequired: organizacionQuestion.isRequired,
//           },
//         ],
//       },
//     },
//     include: {
//       answers: true,
//     }
//   });

//   console.log('✅ Se creó una respuesta para la encuesta.');
// }

// main()
// .catch((e) => {
//   console.error(e);
//   process.exit(1);
// })
// .finally(async () => {
//   await prisma.$disconnect();
// });
