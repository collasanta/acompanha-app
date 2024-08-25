"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BlockEditor } from "@/components/BlockEditor";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { registerNewDiet, getDietPlanById } from "@/lib/diets";
import toast from "react-hot-toast";

const dietFormSchema = z.object({
  dietName: z.string().min(1, "Nome da dieta é obrigatório"),
  dietTemplate: z.string().optional(),
  dietContent: z.string().min(1, "Descrição da dieta é obrigatória"),
  isTemplate: z.boolean().default(false),
  clientId: z.string().optional(),
  replaceCurrentDiet: z.boolean().optional(),
});

type DietFormSchemaType = z.infer<typeof dietFormSchema>;

type DietRegistrationFormProps = {
  initialDietTemplates: { id: string; name: string }[];
  initialClients: {
    id: string;
    name: string;
    currentDietPlanId?: string | null;
  }[];
};

export default function DietRegistrationForm({
  initialDietTemplates,
  initialClients,
}: DietRegistrationFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedClientHasDiet, setSelectedClientHasDiet] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { editor } = useBlockEditor({
    content: undefined,
  });

  console.log("akii", searchParams.keys());
  const form = useForm<DietFormSchemaType>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      dietName: "",
      dietContent: "",
      isTemplate: false,
      clientId: searchParams.get("clientId") || undefined,
      dietTemplate: "",
      replaceCurrentDiet: searchParams.get("replaceCurrentDiet") === "true",
    },
  });

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    const replaceCurrentDiet = searchParams.get("replaceCurrentDiet");

    if (clientId) {
      form.setValue("clientId", clientId);
    }

    if (replaceCurrentDiet === "true") {
      form.setValue("replaceCurrentDiet", true);
    }
  }, [searchParams, form]);

  useEffect(() => {
    const clientId = form.watch("clientId");
    const selectedClient = initialClients.find(
      (client) => client.id === clientId
    );
    setSelectedClientHasDiet(!!selectedClient?.currentDietPlanId);
  }, [form.watch("clientId"), initialClients]);

  const handleTemplateSelect = async (templateId: string) => {
    if (templateId) {
      const result = await getDietPlanById(templateId);
      if ("dietPlan" in result && result.dietPlan) {
        const { content } = result.dietPlan;
        form.setValue("dietContent", content);
        if (editor) {
          editor.commands.setContent(JSON.parse(content));
        }
      } else if ("error" in result) {
        toast.error("Erro ao buscar plano de dieta: " + result.error);
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
      const result = await registerNewDiet({
        ...data,
        replaceCurrentDiet: selectedClientHasDiet
          ? data.replaceCurrentDiet
          : undefined,
      });
      setLoading(false);
      if ("error" in result) {
        toast.error(`Erro ao cadastrar dieta: ${result.error}`);
      } else {
        toast.success(`Dieta cadastrada com sucesso. ID: ${result.dietId}`);
        if (data.clientId && data.replaceCurrentDiet) {
          router.push(`/clients/${data.clientId}`);
        } else {
          router.push(`/diets`);
        }
      }
    } else {
      toast.error(
        `Formulário inválido: ${JSON.stringify(form.formState.errors)}`
      );
    }
  };

  return (
    <div className="px-4 md:px-20 lg:px-32 md:max-w-[1200px] mx-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="dietName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Dieta</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da dieta" {...field} />
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
                <FormLabel>Escolher um Modelo Inicial Dieta</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl className="cursor-pointer">
                      <Input
                        placeholder="Selecione um modelo de dieta"
                        value={
                          initialDietTemplates.find(
                            (template) => template.id === field.value
                          )?.name || ""
                        }
                        onChange={() => {}}
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto">
                    <Command>
                      <CommandInput
                        placeholder="Buscar modelo..."
                        className="h-9"
                      />
                      <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                      <CommandGroup>
                        {initialDietTemplates.map((template) => (
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
                <FormLabel>Conteúdo da Dieta</FormLabel>
                <FormControl>
                  <BlockEditor
                    content={field.value ? JSON.parse(field.value) : undefined}
                    editor={editor}
                  />
                </FormControl>
                <FormMessage />
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("replaceCurrentDiet", false);
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {initialClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="replaceCurrentDiet"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Substituir dieta atual do cliente</FormLabel>
                  <FormDescription>
                    Marque esta opção se deseja substituir a dieta atual do
                    cliente por essa nova dieta
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-center pb-[120px] pt-[30px]">
            <div className="flex-col flex space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar Dieta"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Voltar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
