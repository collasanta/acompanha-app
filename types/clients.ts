import * as z from "zod"

export const clientsFormSchema = z.object({
  clientName: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  clientWhatsapp: z.string().min(10, {
    message: "O número de WhatsApp deve ter pelo menos 10 dígitos.",
  }),
  clientEmail: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
  clientSex: z.enum(["masculino", "feminino"], {
    required_error: "Por favor, selecione o sexo.",
  }),
  clientAge: z.number().min(1, {
    message: "A idade deve ser um número positivo.",
  }),
})

export type clientsFormSchemaType = z.infer<typeof clientsFormSchema>