"use client"
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useState } from "react";
import { createNewProfessional } from "@/lib/professional";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalFormSchema, professionalFormType } from "@/types/professionals";
import { Button } from "@/components/ui/button"

export const NewUserModal = () => {

    const form = useForm<professionalFormType>({
        resolver: zodResolver(professionalFormSchema),
        defaultValues: {
            professionalName: "",
            professionalJob: "",
            professionalAvgClientsSurvey: undefined,
            whatsapp: "",
            email: ""
        },
    })

    async function onSubmit(values: professionalFormType) {
        const registerResult = await createNewProfessional(values)
        console.log("registerResult", registerResult)
        if (registerResult) {
            setOpen(false)
        } else {
            console.log("Erro ao criar usuário")
        }
    }

    async function RegisterProfessional() {

    }
    const [open, setOpen] = useState<boolean>(true)
    return (
        <>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bem Vindo ao Acompanha.App</AlertDialogTitle>
                        <AlertDialogDescription className="py-2">
                            Para começar, precisamos de algumas informações suas:
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="professionalName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row space-x-4">
                                            <FormLabel>Nome Completo</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Giovanni Correa" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="professionalJob"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row space-x-4">
                                            <FormLabel>Profissão</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Nutricionista" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="professionalAvgClientsSurvey"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row space-x-4">
                                            <FormLabel>Quantos pacientes você atende em média no mês?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="15" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row space-x-4">
                                            <FormLabel>Qual seu melhor e-mail?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="joao@gmail.com" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row space-x-4">
                                            <FormLabel>Qual é o seu Whatsapp?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="+5511991234567" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                    <AlertDialogFooter>
                        <AlertDialogAction>
                            <Button type="submit">Continuar</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
