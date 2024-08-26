"use client";

import React from "react";
import {
  UtensilsCrossedIcon,
  CopyIcon,
  ExternalLinkIcon,
  AppWindowIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface AppDietLinkProps {
  clientId: string;
  className?: string;
}

const AppDietLink: React.FC<AppDietLinkProps> = ({
  clientId,
  className = "",
}) => {
  const dietLink = `${window.location.origin}/d/${clientId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dietLink).then(
      () => {
        toast.success("Link copiado com sucesso");
      },
      () => {
        toast.error("Falha ao copiar o link. Por favor, tente novamente.");
      }
    );
  };

  const handleAccessApp = () => {
    window.location.href = dietLink;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleCopyLink}
      >
        <UtensilsCrossedIcon className="w-5 h-5 text-emerald-500" />
        <span className="font-medium">App Dieta: </span>
        <span className="text-muted-foreground mr-2">{dietLink}</span>
        <CopyIcon className="w-4 h-4 ml-2" />
      </div>
      <ExternalLinkIcon
        className="w-4 h-4 ml-2 cursor-pointer"
        onClick={handleAccessApp}
      />
    </div>
  );
};

export default AppDietLink;
