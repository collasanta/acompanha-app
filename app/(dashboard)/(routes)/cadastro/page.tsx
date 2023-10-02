"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { registerNewProgram } from "@/lib/programs"


export default function Home() {
  const [finalForm, setFinalForm] = useState<programsFormSchemaType>()
  const [validForm, setValidForm] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter()

  async function registerProgram() {
    setLoading(true)
    const result = await registerNewProgram(finalForm!)
    if (result.erro) {
      const errorMessage = result.erro;
      console.log("Server Error Validation:", errorMessage)
    } else if (result.programId) {
      console.log("Programa Cadastrado com Sucesso!", result.programId)
      router.push(`/p/${result.programId}`)
    }
    setLoading(false)
  }

  function onSubmit(values: programsFormSchemaType) {
    console.log("values", values)
    const startDate = new Date(values.startDate);
    const endDate = new Date(startDate.getTime() + values.duration * 24 * 60 * 60 * 1000); // Add days in milliseconds
    const finalForm = { ...values, endDate: endDate };
    setFinalForm(finalForm)
    setValidForm(true)
  }

  const form = useForm<programsFormSchemaType>({
    resolver: zodResolver(programsFormSchema),
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
                  <div className="flex flex-row space-x-4">
                    <FormLabel>Whatsapp do Cliente</FormLabel>
                    <Popover>
                      <PopoverTrigger type="button">
                        <InfoIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-[12px] pl-1">Whatsapp onde o cliente receberá as mensagens</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input placeholder="+551199123456" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row space-x-4">
                    <FormLabel>Nome do Programa</FormLabel>
                    <Popover>
                      <PopoverTrigger type="button">
                        <InfoIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-[12px] pl-1">Descrição breve sobre a finalidade do programa</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input placeholder="Projeto de Emagrecimento 21 dias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex flex-row space-x-4">
                    <FormLabel>Data de início do Programa</FormLabel>
                    <Popover>
                      <PopoverTrigger type="button">
                        <InfoIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-[12px] pl-1">Dia em que a 1º mensagem de acompanhamento será enviada pelo robô no whatsapp</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>👉 Escolher Data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {/* <PopoverClose> */}
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(e) => { field.onChange(e); setIsCalendarOpen(false); }}
                          // disabled={(date) =>
                          //   date < new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                          locale={ptBR}
                        />
                        {/* </PopoverClose> */}
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row space-x-4">
                    <FormLabel>Duração do Programa</FormLabel>
                    <Popover>
                      <PopoverTrigger type="button">
                        <InfoIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-[12px] pl-1">Dias que o programa irá durar após a data início</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input placeholder="21 dias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mx-auto pt-1">
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
                          <FormLabel className=" text-sm  text-muted-foreground">Peso 🧍</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-[30px] h-[30px] mx-auto" />
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
                          <FormLabel className="text-sm text-muted-foreground">Dieta 🥦</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-[30px] h-[30px] mx-auto" />
                            {/* <Input type="checkbox" defaultValue={"true"} className="w-[30px] mx-auto" {...field} /> */}
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
                          <FormLabel className=" text-sm  text-muted-foreground">Treino 💪</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-[30px] h-[30px] mx-auto" />
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

            <div className="flex justify-center pb-[120px]">
              <Button type="submit">Cadastrar Programa</Button>
              {finalForm && validForm &&
                <>

                  <AlertDialog open={!!finalForm}>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirme os dados antes de prosseguir</AlertDialogTitle>
                        <AlertDialogDescription className="py-6">
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
                        <AlertDialogCancel onClick={() => setValidForm(false)}>
                          Voltar
                        </AlertDialogCancel>
                        { 
                          isLoading ? (
                            <AlertDialogAction className="mx-auto min-w-[90px]">
                              <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </AlertDialogAction>
                          )
                            :
                            <>
                              <AlertDialogAction onClick={registerProgram}>Confirmar</AlertDialogAction>
                            </>
                        }
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              }
            </div>

          </form>
        </Form>

      </div>
    </div>
  )
}
