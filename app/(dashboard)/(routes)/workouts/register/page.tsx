"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { BlockEditor } from "@/components/BlockEditor";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import {
  registerNewWorkout,
  getWorkoutPlansByProfessional,
  getWorkoutPlanById,
} from "@/lib/workouts";
import toast from "react-hot-toast";

// Define the form schema
const workoutFormSchema = z.object({
  workoutName: z.string().min(1, "Workout name is required"),
  workoutTemplate: z.string().optional(),
  workoutContent: z.string().min(1, "Workout description is required"),
  isTemplate: z.boolean().default(false),
  clientId: z.string().optional(),
});

type WorkoutFormSchemaType = z.infer<typeof workoutFormSchema>;

export default function WorkoutRegistration() {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [workoutTemplates, setWorkoutTemplates] = useState<
    { id: string; name: string }[]
  >([]);

  const router = useRouter();

  const { editor } = useBlockEditor({
    content: undefined,
  });

  const form = useForm<WorkoutFormSchemaType>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      workoutName: "",
      workoutContent: "",
      isTemplate: false,
      clientId: undefined,
      workoutTemplate: "",
    },
  });

  useEffect(() => {
    const fetchWorkoutTemplates = async () => {
      const result = await getWorkoutPlansByProfessional();
      if (result.workoutPlans) {
        setWorkoutTemplates([
          { id: "", name: "Nenhum - Clique para selecionar" },
          ...result.workoutPlans,
        ]);
      } else if (result.error) {
        toast.error("Error fetching workout templates:", result.error);
      }
    };

    fetchWorkoutTemplates();
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    if (templateId) {
      const result = await getWorkoutPlanById(templateId);
      if (result.workoutPlan) {
        const { content } = result.workoutPlan;
        form.setValue("workoutContent", content);
        if (editor) {
          editor.commands.setContent(JSON.parse(content));
        }
      } else if (result.error) {
        toast.error("Error fetching workout plan:", result.error);
      }
    }
    form.setValue("workoutTemplate", templateId);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editor) {
      const editorContent = JSON.stringify(editor.getJSON());
      form.setValue("workoutContent", editorContent, { shouldValidate: true });
    }
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      setLoading(true);
      const result = await registerNewWorkout(data);
      setLoading(false);
      if (result.error) {
        toast.error(`Error registering workout: ${result.error}`);
        alert("Erro ao cadastrar treino. Por favor, tente novamente.");
      } else {
        toast.success(`Treino Cadastrado com sucesso. ID: ${result.workoutId}`);
        // Optionally, redirect to the new workout page
        router.push(`/workouts`);
      }
    } else {
      toast.error(`Form is invalid: ${form.formState.errors}`);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="workoutName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Treino (Interno)</FormLabel>
                  <FormControl>
                    <Input placeholder="Treino de Força" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workoutTemplate"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Modelo de Treino</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl className="cursor-pointer">
                        <Input
                          placeholder="Buscar template..."
                          value={
                            workoutTemplates.find(
                              (template) => template.id === field.value
                            )?.name || ""
                          }
                          onChange={() => {}}
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto"
                      align="start"
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Buscar template..."
                          className="h-9"
                        />
                        <CommandEmpty>Nenhum template encontrado.</CommandEmpty>
                        <CommandGroup>
                          {workoutTemplates.map((template) => (
                            <CommandItem
                              key={template.id}
                              value={template.name}
                              onSelect={() => handleTemplateSelect(template.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  template.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {template.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workoutContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Treino</FormLabel>
                  <FormControl>
                    <BlockEditor
                      content={
                        field.value ? JSON.parse(field.value) : undefined
                      }
                      editor={editor}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
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
            /> */}

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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar Treino"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/workouts")}
                >
                  Voltar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
