import * as z from "zod"

export const professionalFormSchema = z.object({
    professionalName: z.string().min(6, {
      message: "Favor inserir Nome e Sobrenome",
    }),
    professionalJob: z.string().min(6, {
      message: "Favor inserir sua Profissão",
    }),
    professionalAvgClientsSurvey:  z.coerce.number().min(0, {
      message: "Favor inserir quantos pacientes atende por mês",
    }),
    email: z.string().email({
      message: "Favor inserir um email válido",
    }),
    whatsapp: z.string().refine((value) => {
      const whatsappRegex = /^\+\d{1,3}\d{6,}$/;
      return whatsappRegex.test(value);
    }, {
      message: "Número de WhatsApp incorreto. Deve estar no formato internacional +5511991234567",
    }),
  });

  export type professionalFormType =  z.infer<typeof professionalFormSchema>

