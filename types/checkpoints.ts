export interface checkpointType {
    id: string;
    formUrl: string | null;
    programId: string;
    description: string;
    date: Date;
    dietPlanUrl: string | null;
    trainingPlanUrl: string | null;
    formFilled: boolean | null;
  }