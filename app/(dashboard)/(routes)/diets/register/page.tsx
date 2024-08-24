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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
  registerNewDiet,
  getDietPlansByProfessional,
  getDietPlanById,
} from "@/lib/diets";
import toast from "react-hot-toast";

// Define the form schema
const dietFormSchema = z.object({
  dietName: z.string().min(1, "Diet name is required"),
  dietTemplate: z.string().optional(),
  dietContent: z.string().min(1, "Diet description is required"),
  isTemplate: z.boolean().default(false),
  clientId: z.string().optional(),
});

type DietFormSchemaType = z.infer<typeof dietFormSchema>;

export default function DietRegistration() {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dietTemplates, setDietTemplates] = useState<
    { id: string; name: string }[]
  >([]);

  const router = useRouter();

  const { editor } = useBlockEditor({
    content: undefined,
  });

  const form = useForm<DietFormSchemaType>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      dietName: "",
      dietContent: "",
      isTemplate: false,
      clientId: undefined,
      dietTemplate: "",
    },
  });

  useEffect(() => {
    const fetchDietTemplates = async () => {
      const result = await getDietPlansByProfessional();
      if (result.dietPlans) {
        setDietTemplates([
          { id: "", name: "Nenhum - Clique para selecionar" },
          ...result.dietPlans,
        ]);
      } else if (result.error) {
        toast.error("Error fetching diet templates:", result.error);
      }
    };

    fetchDietTemplates();
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    if (templateId) {
      const result = await getDietPlanById(templateId);
      if (result.dietPlan) {
        const { content } = result.dietPlan;
        form.setValue("dietContent", content);
        if (editor) {
          editor.commands.setContent(JSON.parse(content));
        }
      } else if (result.error) {
        toast.error("Error fetching diet plan:", result.error);
      }
    }
    form.setValue("dietTemplate", templateId);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editor) {
      const editorContent = JSON.stringify(editor.getJSON());
      form.setValue("dietContent", editorContent, { shouldValidate: true });
    }
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      setLoading(true);
      const result = await registerNewDiet(data);
      setLoading(false);
      if (result.error) {
        toast.error(`Error registering diet: ${result.error}`);
      } else {
        toast.success(`Dieta cadastrada com sucesso. ID: ${result.dietId}`);
        router.push(`/diets`);
      }
    } else {
      toast.error(`Formulário inválido: ${form.formState.errors}`);
    }
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro de Dietas
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Cadastre novas Dietas
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 md:max-w-[1200px] mx-auto">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="dietName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Dieta (Interno)</FormLabel>
                  <FormControl>
                    <Input placeholder="Dieta Low Carb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietTemplate"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Modelo de Dieta</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl className="cursor-pointer">
                        <Input
                          placeholder="Buscar template..."
                          value={
                            dietTemplates.find(
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
                          {dietTemplates.map((template) => (
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
              name="dietContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Dieta</FormLabel>
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

            <div className="flex justify-center pb-[120px]">
              <div className="flex-col flex space-y-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar Dieta"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/diets")}
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
