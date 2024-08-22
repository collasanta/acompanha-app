"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { ButtonOriginal } from "@/components/ui/button-original";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BlockEditor } from "@/components/BlockEditor";

// Define the form schema
const workoutFormSchema = z.object({
  workoutName: z.string().min(1, "Workout name is required"),
  workoutDescription: z.string().min(1, "Workout description is required"),
  isTemplate: z.boolean().default(false),
  clientId: z.string().optional(),
});

type WorkoutFormSchemaType = z.infer<typeof workoutFormSchema>;

// Mock function for creating a new workout
const createNewWorkout = async (data: WorkoutFormSchemaType) => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { workoutId: "123" };
};

export default function WorkoutRegistration() {
  const [finalForm, setFinalForm] = useState<WorkoutFormSchemaType>();
  const [validForm, setValidForm] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<WorkoutFormSchemaType>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      workoutName: "",
      workoutDescription: "",
      isTemplate: false,
      clientId: undefined,
    },
  });

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro de Treinos
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Cadastre novos Treinos
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 md:max-w-[1200px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(()=> createNewWorkout)} className="space-y-6">
            <FormField
              control={form.control}
              name="workoutName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Treino</FormLabel>
                  <FormControl>
                    <Input placeholder="Treino de Força" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workoutDescription"
              render={({ field }) => (
                <FormItem >
                  <FormLabel> Descrição do Treino</FormLabel>
                  <FormControl > 
                    <BlockEditor />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTemplate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Salvar como Template</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Este treino poderá ser usado como base para outros
                      clientes
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atribuir a Cliente (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Santos</SelectItem>
                      <SelectItem value="3">Pedro Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pb-[120px]">
              <div className="flex-col flex space-y-2">
                <ButtonOriginal type="submit">Cadastrar Treino</ButtonOriginal>
                <ButtonOriginal
                  variant="outline"
                  type="button"
                  onClick={() => router.push(`/workouts`)}
                >
                  Voltar
                </ButtonOriginal>
              </div>
              {finalForm && validForm && (
                <AlertDialog open={!!finalForm}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirme os dados antes de prosseguir
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-6">
                        <div className="flex flex-col space-y-2">
                          <div className="flex flex-row space-x-2">
                            <div className="font-semibold">Nome do Treino:</div>
                            <div>{finalForm?.workoutName}</div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <div className="font-semibold">Descrição:</div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: finalForm?.workoutDescription || "",
                              }}
                            />
                          </div>
                          <div className="flex flex-row space-x-2">
                            <div className="font-semibold">Template:</div>
                            <div>{finalForm?.isTemplate ? "Sim" : "Não"}</div>
                          </div>
                          <div className="flex flex-row space-x-2">
                            <div className="font-semibold">
                              Cliente Atribuído:
                            </div>
                            <div>{finalForm?.clientId || "Nenhum"}</div>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setValidForm(false)}>
                        Voltar
                      </AlertDialogCancel>
                      {isLoading ? (
                        <AlertDialogAction
                          disabled
                          className="mx-auto min-w-[90px]"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </AlertDialogAction>
                      ) : (
                        <AlertDialogAction onClick={()=>createNewWorkout}>
                          Confirmar
                        </AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
