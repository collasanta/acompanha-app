"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

const formSchema = z.object({
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
  metricspeso: z.boolean(),
  metricsdieta: z.boolean(),
  metricstreino: z.boolean(),
});


export default function Home() {
  const [finalForm, setFinalForm] = useState<object>()

  async function cadastraPrograma() {
      console.log("cadastraPrograma")
      console.log(finalForm)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const startDate = new Date(values.startDate);
    const endDate = new Date(startDate.getTime() + values.duration * 24 * 60 * 60 * 1000); // Add days in milliseconds
    const finalForm = { ...values, endDate: endDate };
    setFinalForm(finalForm)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientWhatsapp: "",
      programName: "",
      duration: undefined,
      startDate: undefined,
      metricspeso: true,
      metricsdieta: true,
      metricstreino: true,
    },
  })


  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Cadastre novos programas para seus clientes
        </p>
      </div>
      <div className=" px-4 md:px-20 lg:px-32 space-y-4  md:max-w-[800px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="João Oliveira" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientWhatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="+551199123456" {...field} />
                  </FormControl>
                  <FormDescription>
                    Whatsapp onde o cliente receberá as mensagens
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Programa</FormLabel>
                  <FormControl>
                    <Input placeholder="Projeto de Emagrecimento 21 dias" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição breve sobre a finalidade do programa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de início do Programa</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    // value={new Date(field.value).toISOString().slice(0, -1)}
                    // onChange={(event) =>
                    // field.onChange(event.target.value)
                    // }
                    />
                  </FormControl>
                  <FormDescription>
                    Dia em que a 1º mensagem será enviada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração do Programa</FormLabel>
                  <FormControl>
                    <Input placeholder="21" {...field} />
                  </FormControl>
                  <FormDescription>
                    Dias que o programa irá durar após a data início
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mx-auto pt-4">
              <div className="flex flex-col">
                <a className="text-md pb-4 mx-auto font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Métricas para Acompanhar
                </a>
              </div>
              <div className="flex flex-col mx-auto text-center">
                <div className="flex space-x-10 justify-center text-center">
                  <FormField
                    control={form.control}
                    name="metricspeso"
                    render={({ field }) => (
                      <div className="flex flex-row space-x-8 justify-center pt-[10px]">
                        <FormItem className="flex flex-col">
                          <FormLabel className=" text-sm  text-muted-foreground">Peso</FormLabel>
                          <FormControl>
                            <Input type="checkbox" className="w-[30px] mx-auto" {...field} name="metrics" />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metricsdieta"
                    render={({ field }) => (
                      <div className="flex flex-row space-x-8 justify-center pt-[10px]">
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm text-muted-foreground">Dieta</FormLabel>
                          <FormControl>
                            <Input type="checkbox" className="w-[30px] mx-auto" {...field} name="metrics" />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metricstreino"
                    render={({ field }) => (
                      <div className="flex flex-row space-x-8 justify-center pt-[10px]">
                        <FormItem className="flex flex-col">
                          <FormLabel className=" text-sm  text-muted-foreground">Treino</FormLabel>
                          <FormControl>
                            <Input type="checkbox" className=" w-[30px] mx-auto" {...field} name="metrics" />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
                <a className="pt-4 text-sm  text-muted-foreground">
                  Selecione Clicando 👆
                </a>

              </div>
            </div>

            <div className="flex justify-center pt-4 pb-[120px]">
              <AlertDialog>
                <AlertDialogTrigger>
            <Button type="submit">Cadastrar Programa</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirme os dados antes de prosseguir</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Nome do Cliente:</div>
                          <div>{finalForm?.clientName}</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Whatsapp do Cliente:</div>
                          <div>{finalForm?.clientWhatsapp}</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Nome do Programa:</div>
                          <div>{finalForm?.programName}</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Data de Início:</div>
                          <div>{finalForm?.startDate?.toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Data de Término:</div>
                          <div>{finalForm?.endDate?.toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Duração:</div>
                          <div>{finalForm?.duration} dias</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <div className="font-semibold">Métricas Acompanhadas:</div>
                          <div>
                            {finalForm?.metricspeso ? "Peso " : ""}
                            {finalForm?.metricsdieta ? "Dieta " : ""}
                            {finalForm?.metricstreino ? "Treino " : ""}
                          </div>
                        </div>
                      </div>

                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={cadastraPrograma}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>


          </form>
        </Form>

      </div>
    </div>
  )
}
