// components/dietHeaders.tsx
"use client";

import { useState } from "react";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";
import Image from "next/image";
import { formatDateToDdMmYy } from "@/lib/utils";
import { DietPlanType } from "@/types/diets";
import { ClientType } from "@/types/clients";

export const DietHeader = ({
  client,
  diet,
  collapsed = false,
}: {
  client: ClientType;
  diet: DietPlanType;
  collapsed?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(collapsed);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="bg-white w-full flex justify-center">
      <div className="flex flex-col shadow-md w-full max-w-[550px] rounded-tr-[50px] w-full bg-transparent border border-[3px] text-card-foreground text-[13px]">
        <div className="flex items-center justify-center">
          <div className="flex justify-center min-w-[80px] h-full bg-white border-r-2 border-dashed">
            <Image width={70} height={70} alt="logo" src="/logo-vazado.png" />
          </div>
          <div className="flex flex-col w-full py-2 bg-[#fcfdff] rounded-tr-[50px]">
            <div className="flex flex-row justify-between h-[25px]">
              <div className="pl-4 sm:pl-6 align-text-bottom font-semibold max-w-[220px] truncate text-muted-foreground text-sm text-start whitespace-break-spaces">
                {client.name}
              </div>
              <div className="mr-8 cursor-pointer" onClick={handleClick}>
                {isOpen ? (
                  <MinusCircleIcon
                    className="w-5 h-5 transform rotate-180 align-bottom"
                    color="#999999"
                  />
                ) : (
                  <PlusCircleIcon className="w-5 h-5" color="#999999" />
                )}
              </div>
            </div>
            <div className="flex flex-row h-[25px] border-t-2 border-dashed justify-between">
              <div className="pt-1 pl-4 sm:pl-6 text-muted-foreground text-sm text-start max-w-[220px] sm:max-w-[500px] truncate">
                {diet.name}
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="flex flex-col">
            <div className="flex justify-center border-t-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>{client.name}</span>
                </div>
                {client.age && (
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Idade:</span>
                    <span>{client.age} anos</span>
                  </div>
                )}
                {client.genre && (
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Gênero:</span>
                    <span>{client.genre}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    Atualizado em: {formatDateToDdMmYy(diet.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
