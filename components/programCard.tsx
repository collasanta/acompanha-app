"use client";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { programsFrontEndListType } from "@/types/programs";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { formatDateToDdMmWeek, formatDateToDdMmYy } from "@/lib/utils";
import { deleteProgram } from "@/lib/programs";
import toast from "react-hot-toast";

export const ProgramCard = ({
  program,
  collapsed = false,
}: {
  program: programsFrontEndListType;
  collapsed?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(collapsed);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function handleDeleteProgram(programId: string) {
    setIsLoading(true);
    deleteProgram(programId)
      .then((res) => {
        setIsLoading(false);
        setConfirmDelete(false);
        if (res.status === "deleted") {
          toast.success("Diário deletado com sucesso");
        } else {
          toast.error("Erro ao deletar diário: " + res.error);
        }
      })
      .catch((res) => {
        setIsLoading(false);
        setConfirmDelete(false);
        toast.error("Erro ao deletar diário: " + res.error);
      });
  }

  return (
    <div className="flex shadow-sm rounded-sm sm:py-4 sm:px-2 py-1 px-3 flex-col border mx-auto max-w-[550px] w-full bg-secondary border border-0 text-card-foreground text-[13px] hover:shadow-lg transition ">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={handleClick}
      >
        <div className="ml-3 flex md:flex-row items-center gap-x-2 truncate">
          📝
        </div>
        <div className="flex flex-col sm:flex-row">
          <p className="pr-2 text-center whitespace-break-spaces font-semibold text-muted-foreground text-sm">
            {program.client.name.length > 30
              ? program.client.name.substring(0, 30) + "..."
              : program.client.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {program.name.length > 30
              ? program.name.substring(0, 30) + "..."
              : program.name}
          </p>
        </div>
        <div>
          {isOpen ? (
            <MinusCircleIcon
              className="w-5 h-5 transform rotate-180"
              color="#52525b"
            />
          ) : (
            <PlusCircleIcon className="w-5 h-5" color="#52525b" />
          )}
        </div>
      </div>
      {isOpen && (
        <>
          <div className="mt-2 flex justify-center border bg-card border-black/5 rounded-lg p-2">
            <div className="flex flex-row items-center text-center space-x-6">
              <div>
                <div className="">
                  <div className="font-[500] ">Data Início: </div>
                </div>
                <div className="text-muted-foreground">
                  <div>{formatDateToDdMmYy(program.start_date)}</div>
                </div>
              </div>
              <div>
                <div className="">
                  <div className="font-[500] ">Data Fim: </div>
                </div>
                <div className="text-muted-foreground">
                  <div>{formatDateToDdMmYy(program.end_date)}</div>
                </div>
              </div>
              <div>
                <div className="col-span-1">
                  <div className="font-[500] ">Duração: </div>
                </div>
                <div className="col-span-1 text-muted-foreground">
                  <div>{program.duration} Dias</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center flex flex-col  justify-center border bg-card border-black/5 rounded-lg p-2">
            <div className="font-[500]">Link de Acompanhamento</div>
            <div className="flex text-center text-center mx-auto text-cyan-600">
              <Link href={"/p/" + program.id}>
                {window.location.origin + "/p/" + program.id}
              </Link>
            </div>
          </div>

          <div>
            <div className="mt-2 text-center flex flex-col  justify-center border bg-card border-black/5 rounded-lg p-2">
              <div className="font-[500]">Métricas Acompanhadas</div>
              <div className="flex text-center">
                {Object.entries(program?.enabled_metrics!).map(
                  ([metricName, metricValue], index) => {
                    if (metricValue === true) {
                      return (
                        <div
                          key={index}
                          className="text-center text-muted-foreground mx-auto mt-1"
                        >
                          <div className="font-[500] capitalize">
                            {metricName}{" "}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 text-center flex flex-row  justify-center bg-muted rounded-lg p-2">
            <Button
              onClick={() => setConfirmDelete(true)}
              variant={"outline"}
              className="font-[500] px-2 text-sm bg-muted shadow-sm hover:shadow-md text-muted-foreground"
            >
              Deletar
              <Trash2Icon className="ml-1 w-4 h-4 " color="#708096" />
            </Button>
          </div>

          <AlertDialog open={confirmDelete}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Tem certeza que deseja deletar o diário ?
                </AlertDialogTitle>
                <AlertDialogDescription className="pb-6 px-2 flex justify-center">
                  <div className="flex flex-col space-y-2 justify-center">
                    <div className="flex flex-col justify-center align-middle items-center text-start py-4">
                      <div className="max-w-[250px] truncate">
                        <div className="pt-1">
                          <span className="font-semibold ">Cliente: </span>
                          {program.client.name}
                        </div>
                        <div className="pt-1">
                          <span className="font-semibold">Programa: </span>
                          {program.name}
                        </div>
                        <div className="pt-1">
                          <span className="font-semibold">Duração: </span>{" "}
                          {program.duration} Dias
                        </div>
                        <div className="pt-1">
                          <span className="font-semibold">Data Início:</span>{" "}
                          {formatDateToDdMmYy(program.start_date)}
                        </div>
                        <div>
                          <span className="font-semibold pt-1">Data Fim:</span>{" "}
                          {formatDateToDdMmYy(program.end_date)}
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
                  <>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-800"
                      onClick={() => handleDeleteProgram(program.id)}
                    >
                      Deletar
                    </AlertDialogAction>
                  </>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};
