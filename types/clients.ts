import * as z from "zod"

export type ErrorResponseType = {
  error: string | undefined
}

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
  currentDietPlanId: z.string().nullable(),
})

export type ClientsFormSchemaType = z.infer<typeof clientsFormSchema>

export type ClientType = {
  id: string;
  name: string;
  whatsapp: string | null;
  email: string | null;
  info: string | null;
  genre: string | null;
  age: number | null;
  professionalId: string;
  createdAt: Date;
  updatedAt: Date;
  currentDietPlanId?: string | null;
}

export type ReqClientsType = Array<ClientType> | ErrorResponseType;

export type ReqClientType = ClientType | ErrorResponseType;