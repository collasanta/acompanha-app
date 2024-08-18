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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { clientsFormSchema, clientsFormSchemaType } from "@/types/clients"
import { InfoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { createNewClient } from "@/lib/client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ClientRegistration() {
  const [finalForm, setFinalForm] = useState<clientsFormSchemaType>()
  const [validForm, setValidForm] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const router = useRouter()

  async function registerClient() {
    setLoading(true)
    window.alert('wow')
    // const result = await createNewClient(finalForm!)
    // if (result.erro) {
    //   const errorMessage = result.erro;
    //   console.log("Server Error Validation:", errorMessage)
    // } else if (result.clientId) {
    //   console.log("Cliente Cadastrado com Sucesso!", result.clientId)
    //   router.push(`/clients/${result.clientId}`)
    // }
    setLoading(false)
  }

  function onSubmit(values: clientsFormSchemaType) {
    setFinalForm(values)
    setValidForm(true)
  }

  const form = useForm<clientsFormSchemaType>({
    resolver: zodResolver(clientsFormSchema),
    defaultValues: {
      clientName: "",
      clientWhatsapp: "",
      clientSex: undefined,
      clientAge: undefined,
      clientEmail: "",
    },
  })

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro de Cliente
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Cadastre novos clientes
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 md:max-w-[800px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João Oliveira" {...field} />
                  </FormControl>
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
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do Cliente</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cliente@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="masculino" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Masculino
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="feminino" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Feminino
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pb-[120px]">
              <Button type="submit">Cadastrar Cliente</Button>
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
                              <div className="font-semibold">E-mail do Cliente:</div>
                              <div>{finalForm?.clientEmail}</div>
                            </div>
                            <div className="flex flex-row space-x-2">
                              <div className="font-semibold">Sexo:</div>
                              <div>{finalForm?.clientSex}</div>
                            </div>
                            <div className="flex flex-row space-x-2">
                              <div className="font-semibold">Idade:</div>
                              <div>{finalForm?.clientAge}</div>
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
                              <AlertDialogAction onClick={registerClient}>Confirmar</AlertDialogAction>
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