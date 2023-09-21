import * as z from "zod"

export const programsFormSchema = z.object({
    clientName: z.string().min(6, {
      message: "Favor inserir Nome e Sobrenome",
    }),
    clientWhatsapp: z.string().refine((value) => {
      const whatsappRegex = /^\+\d{1,3}\d{6,}$/;
      return whatsappRegex.test(value);
    }, {
      message: "Número de WhatsApp incorreto. Deve estar no formato internacional +5511991234567",
    }),
    programName: z.string().min(10, {
      message: "Nome deve ter no mínimo 10 caracteres",
    }),
    duration: z.coerce.number().min(10, {
      message: "Duração do programa deve ser de pelo menos 10 dias",
    }),
    startDate: z.coerce.date().refine((value) => {
      const currentDate = new Date();
      return value > currentDate;
    }, {
      message: "A data de início deve ser no futuro",
    }),
    endDate: z.coerce.date().optional(),
    metricspeso: z.boolean(),
    metricsdieta: z.boolean(),
    metricstreino: z.boolean(),
  });

  export type programsFormSchemaType =  z.infer<typeof programsFormSchema>

