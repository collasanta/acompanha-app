import { JsonValue } from "@prisma/client/runtime/library";
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
  duration: z.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  metricspeso: z.boolean(),
  metricsdieta: z.boolean(),
  metricstreino: z.boolean(),
});

export type programsFormSchemaType = z.infer<typeof programsFormSchema>

export interface programsFrontEndListType {
  client: {
    name: string;
    whatsapp: string | null;
  };
  id: string;
  name: string;
  start_date: Date;
  duration?: number;
  end_date: Date;
  enabled_metrics: JsonValue;
  status: string;
}

export interface DailyDataType {
  programId: string;
  date: Date;
  diet: boolean | null;
  exercise: boolean | null;
  weight: string | null;
  notes: string | null;
  checkpointId: string | null;
}

export interface DailyDataTypeArr extends Array<DailyDataType> { }

export interface ProgramType {
  client: {
    name: string;
    whatsapp: string | null;
  };
  id: string;
  name: string;
  start_date: Date;
  duration: number;
  end_date: Date;
  enabled_metrics: enabledMetricsType;
  status: string;
};

export interface UserProgramResponse {
  userProgram?: {
    client: {
      name: string;
      whatsapp: string | null;
    };
    id: string;
    name: string;
    start_date: Date;
    duration: number;
    end_date: Date;
    enabled_metrics: JsonValue;
    status: string;
  } | null;
  erro?: string; // Optional error message property
}

export interface enabledMetricsType {
  peso: boolean | null;
  dieta: boolean | null;
  treino: boolean | null;
}


