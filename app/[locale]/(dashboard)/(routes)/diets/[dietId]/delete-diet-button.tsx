"use client";

import React, { useState } from "react";
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
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteDiet } from "@/lib/diets";

interface DeleteDietButtonProps {
  dietId: string;
}

export default function DeleteDietButton({ dietId }: DeleteDietButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  async function handleDeleteDiet() {
    setIsLoading(true);
    try {
      const res = await deleteDiet(dietId);
      setIsLoading(false);
      setConfirmDelete(false);
      if (res.status === "deleted") {
        toast.success("Dieta deletada com sucesso");
        router.push("/diets"); // Redirect to diets list page
      } else {
        console.error("Error deleting diet:", res.error);
        toast.error("Erro ao deletar dieta: " + res.error);
      }
    } catch (error: any) {
      console.error("Error in handleDeleteDiet:", error);
      setIsLoading(false);
      setConfirmDelete(false);
      toast.error("Erro ao deletar dieta: " + error.message);
    }
  }

  return (
    <>
      <Button
        onClick={() => setConfirmDelete(true)}
        variant="outline"
        size="sm"
        className="absolute top-6 right-6 hover:text-red-600 hover:bg-white"
      >
        <Trash2Icon className="w-4 h-4" />
      </Button>

      <AlertDialog open={confirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esta dieta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá permanentemente deletar
              a dieta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDelete(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDiet}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? <span className="animate-spin">🔄</span> : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
