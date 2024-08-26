"use client";

import React, { useState } from "react";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  Trash2Icon,
  PencilIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { ClientType } from "@/types/clients";
import Link from "next/link";
import AppDietLink from "./appDietLink";

const ClientCard = ({
  client,
  collapsed = false,
}: {
  client: ClientType;
  collapsed?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(collapsed);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  async function handleDeleteClient(clientId: string) {
    setIsLoading(true);
    try {
      const res = { status: "deleted", error: undefined };
      //   const res = await deleteClient(clientId);
      setIsLoading(false);
      setConfirmDelete(false);
      if (res.status === "deleted") {
        toast.success("Cliente deletado com sucesso");
      } else {
        toast.error("Erro ao deletar cliente: " + res.error);
      }
    } catch (error: any) {
      setIsLoading(false);
      setConfirmDelete(false);
      toast.error("Erro ao deletar cliente: " + error.message);
    }
  }

  return (
    <Card className="w-full max-w-[550px] mx-auto hover:shadow-lg transition">
      <CardContent className="p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">
              {client.name?.length > 30
                ? client.name?.substring(0, 30) + "..."
                : client.name}
            </span>
          </div>
          {isOpen ? (
            <MinusCircleIcon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <PlusCircleIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {isOpen && (
          <>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-muted-foreground" />
                <span>{client.email || "Não informado"}</span>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                <span>{client.whatsapp || "Não informado"}</span>
              </div>

              <AppDietLink clientId={client.id} />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <InfoIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Informações Adicionais</span>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-muted-foreground">
                    {client.info || "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-2">
              <Link href={`/clients/${client.id}`}>
                <Button variant="outline" size="sm">
                  Editar
                  <PencilIcon className="ml-1 w-4 h-4" />
                </Button>
              </Link>
              <Button
                onClick={() => setConfirmDelete(true)}
                variant="outline"
                size="sm"
              >
                Deletar
                <Trash2Icon className="ml-1 w-4 h-4" />
              </Button>
            </div>

            <AlertDialog open={confirmDelete}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Tem certeza que deseja deletar o cliente?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="pb-6 px-2 flex justify-center">
                    <div className="flex flex-col space-y-2 justify-center">
                      <div className="flex flex-col justify-center align-middle items-center text-start py-4">
                        <div className="max-w-[250px] truncate">
                          <div className="pt-1">
                            <span className="font-semibold">Nome: </span>
                            {client.name}
                          </div>
                          <div className="pt-1">
                            <span className="font-semibold">Email: </span>
                            {client.email || "Não informado"}
                          </div>
                          <div className="pt-1">
                            <span className="font-semibold">WhatsApp: </span>
                            {client.whatsapp || "Não informado"}
                          </div>
                          <div className="pt-1">
                            <span className="font-semibold">Idade: </span>
                            {client.age || "Não informado"}
                          </div>
                          <div className="pt-1">
                            <span className="font-semibold">Gênero: </span>
                            {client.genre || "Não informado"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <div className="text-red-600 text-center">
                          Ao deletar, todos os dados serão perdidos sem
                          possibilidade de recuperação
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmDelete(false)}>
                    Voltar
                  </AlertDialogCancel>
                  {isLoading ? (
                    <AlertDialogAction className="mx-auto min-w-[90px] bg-red-600 hover:bg-red-800">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
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
                      <span className="sr-only">Loading...</span>
                    </AlertDialogAction>
                  ) : (
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-800"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Deletar
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCard;
