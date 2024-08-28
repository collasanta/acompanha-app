"use client";

import { formatDateToDdMmWeek, isOffline } from "@/lib/utils";
import { DailyDataType, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  setCardio,
  setDiet,
  setExercise,
  setNotes,
  setWeight,
} from "@/lib/programs";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { LoadingSpinner } from "./loading-spin";

export function TableDay({
  EnabledMetrics,
  day,
  index,
  setOptimisticDays,
}: {
  EnabledMetrics: enabledMetricsType;
  day: DailyDataType;
  index: number;
  setOptimisticDays: Function;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentType, setCurrentType] = useState<string>("");
  const notFuture = day.date.getTime() < Date.now();
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return (
    <>
      <div
        key={day.date.toDateString()}
        className={`flex flex-row border-b border-t border border-black/1 align-middle max-h-[42px] items-center  justify-between text-center ${
          day.date > currentDate || day.date < currentDate
            ? "bg-muted "
            : "bg-[white] font-bold"
        }`}
      >
        <div
          className={`border-r bg-white border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}
        >
          <div className="min-w-[30px] flex justify-center">
            <div className="text-center">
              {formatDateToDdMmWeek(day.date).split(" ")[0]}
            </div>
          </div>

          <div className="min-w-[30px] flex justify-center">
            <div className="italic text-[12px] text-gray-400 pl-1">
              {formatDateToDdMmWeek(day.date).split(" ")[1]}
            </div>
          </div>
        </div>

        {EnabledMetrics.dieta && notFuture ? (
          isLoading && index === currentIndex && currentType === "diet" ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <Button
              variant={"trackingtable"}
              disabled={isLoading}
              onClick={async () => {
                if ((await isOffline()) === true) {
                  return null;
                }
                setOptimisticDays({
                  date: day.date,
                  programId: day.programId,
                  diet: !day.diet,
                  exercise: day.exercise,
                  cardio: day.cardio,
                  weight: day.weight,
                  notes: day.notes,
                  checkpointId: day.checkpointId,
                });
                setCurrentIndex(index);
                setCurrentType("diet");
                setIsLoading(true);
                await setDiet(day.date, day.programId, !day.diet);
                setIsLoading(false);
              }}
              className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
        ${
          day.diet
            ? "bg-[#10B77F] placeholder-white text-white"
            : day.diet === null
            ? day.date.getTime() === currentDate.getTime()
              ? "bg-muted shadow-lg animate-pulse border  border-black/1"
              : day.date.getTime() < currentDate.getTime()
              ? "bg-[#ff6870]"
              : "bg-muted"
            : "bg-[#ff6870]"
        }`}
            >
              {day.diet}
            </Button>
          )
        ) : (
          EnabledMetrics.dieta && <div className="w-[50px]" />
        )}

        {EnabledMetrics.treino && notFuture ? (
          isLoading && index === currentIndex && currentType === "exercise" ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <Button
              variant={"trackingtable"}
              disabled={isLoading}
              onClick={async () => {
                if ((await isOffline()) === true) {
                  return null;
                }
                setOptimisticDays({
                  date: day.date,
                  programId: day.programId,
                  diet: day.diet,
                  exercise: !day.exercise,
                  cardio: day.cardio,
                  weight: day.weight,
                  notes: day.notes,
                  checkpointId: day.checkpointId,
                });
                setCurrentIndex(index);
                setCurrentType("exercise");
                setIsLoading(true);
                await setExercise(day.date, day.programId, !day.exercise);
                setIsLoading(false);
              }}
              className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
            ${
              day.exercise
                ? "bg-[#10B77F] placeholder-white text-white"
                : day.exercise === null
                ? day.date.getTime() === currentDate.getTime()
                  ? "bg-muted shadow-lg animate-pulse border  border-black/1"
                  : day.date.getTime() < currentDate.getTime()
                  ? "bg-[#ff6870]"
                  : "bg-muted"
                : "bg-[#ff6870]"
            }`}
            >
              {day.exercise}
            </Button>
          )
        ) : (
          EnabledMetrics.treino && <div className="w-[50px]" />
        )}

        {EnabledMetrics.cardio && notFuture ? (
          isLoading && index === currentIndex && currentType === "cardio" ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              <input
                type="string"
                disabled={isLoading}
                defaultValue={day.cardio ? day.cardio + "min" : ""}
                onBlur={async (e) => {
                  if ((await isOffline()) === true) {
                    return null;
                  }
                  setOptimisticDays({
                    date: day.date,
                    programId: day.programId,
                    diet: day.diet,
                    cardio: e.target.value === "" ? null : e.target.value,
                    exercise: day.exercise,
                    weight: day.weight,
                    notes: day.notes,
                    checkpointId: day.checkpointId,
                  });
                  setCurrentIndex(index);
                  setCurrentType("cardio");
                  setIsLoading(true);
                  await setCardio(
                    day.date,
                    day.programId,
                    e.target.value,
                    day.cardio ? day.cardio.toString() : null
                  );
                  setIsLoading(false);
                }}
                onChange={(e) =>
                  (e.target.value = e.target.value
                    .replace(/[^0-9.,]/g, "")
                    .replace(/(\..*?)\..*/g, "$1"))
                }
                className={`w-[50px] h-[40px] border border-[1px] text-muted-foreground text-[13px] rounded-md align-middle cursor-pointer text-center disabled:text-muted-foreground disabled:opacity-100 
                                 ${
                                   day.cardio
                                     ? "bg-[#10B77F] text-white font-normal"
                                     : day.cardio === null
                                     ? day.date.getTime() ===
                                       currentDate.getTime()
                                       ? "bg-muted shadow-lg animate-pulse border-black/1 border"
                                       : "bg-muted border"
                                     : "bg-[#ff6870] border"
                                 }`}
              ></input>
            </>
          )
        ) : (
          EnabledMetrics.cardio && <div className="w-[50px] h-[40px]" />
        )}

        {EnabledMetrics.peso && notFuture ? (
          isLoading && index === currentIndex && currentType === "weight" ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              <input
                type="string"
                disabled={isLoading}
                defaultValue={
                  day.weight ? parseFloat(day.weight).toFixed(1) + "kg" : ""
                }
                onBlur={async (e) => {
                  if ((await isOffline()) === true) {
                    return null;
                  }
                  setOptimisticDays({
                    date: day.date,
                    programId: day.programId,
                    diet: day.diet,
                    exercise: day.exercise,
                    cardio: day.cardio,
                    weight: e.target.value === "" ? null : e.target.value,
                    notes: day.notes,
                    checkpointId: day.checkpointId,
                  });
                  setCurrentIndex(index);
                  setCurrentType("weight");
                  setIsLoading(true);
                  await setWeight(
                    day.date,
                    day.programId,
                    e.target.value,
                    day.weight
                  );
                  setIsLoading(false);
                }}
                onChange={(e) =>
                  (e.target.value = e.target.value
                    .replace(/[^0-9.,]/g, "")
                    .replace(/(\..*?)\..*/g, "$1"))
                }
                className={`w-[50px] h-[40px] border border-[1px] text-muted-foreground text-[13px] rounded-md align-middle cursor-pointer text-center disabled:text-muted-foreground disabled:opacity-100 
                                ${
                                  day.weight
                                    ? "bg-[#e2fff5] text-muted-foreground font-normal"
                                    : day.weight === null
                                    ? day.date.getTime() ===
                                      currentDate.getTime()
                                      ? "bg-muted shadow-lg animate-pulse border-black/1 border"
                                      : "bg-muted border"
                                    : "bg-[#ff6870] border"
                                }`}
              ></input>
            </>
          )
        ) : (
          EnabledMetrics.peso && <div className="w-[50px] h-[40px]" />
        )}

        <div className="w-[50px] max-h-[40px]">
          {notFuture && (
            <Popover modal={true}>
              <PopoverTrigger
                disabled={isLoading}
                className="min-w-[50px] align-middle flex justify-center items-center"
              >
                {isLoading &&
                index === currentIndex &&
                currentType === "notes" ? (
                  <>
                    <LoadingSpinner />
                  </>
                ) : (
                  <Button
                    disabled={isLoading}
                    variant={"trackingtable"}
                    onClick={async () => {
                      if ((await isOffline()) === true) {
                        return null;
                      }
                    }}
                    className={`bg-white w-[40px] flex justify-center shadow-md rounded-full border border-[0.5px] text-[11px] cursor-pointer text-center align-middle
                                            ${
                                              day.notes
                                                ? "bg-[#fffee2] muted text-muted-foreground font-normal"
                                                : day.weight === null
                                                ? day.date.getTime() ===
                                                  currentDate.getTime()
                                                  ? "bg-muted shadow-lg animate-pulse border  border-black/1"
                                                  : "bg-muted shadow-none border"
                                                : "bg-muted shadow-none border"
                                            }`}
                  >
                    {day.notes
                      ? "📝"
                      : day.date.getTime() === currentDate.getTime()
                      ? "✍"
                      : ""}
                  </Button>
                )}
              </PopoverTrigger>

              <PopoverContent
                side="top"
                className="w-screen max-w-[450px] bg-card sticky top-[0px] "
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center">
                  <Textarea
                    autoFocus={false}
                    spellCheck={false}
                    onBlur={async (e) => {
                      if ((await isOffline()) === true) {
                        return null;
                      }
                      setOptimisticDays({
                        date: day.date,
                        programId: day.programId,
                        diet: day.diet,
                        exercise: day.exercise,
                        cardio: day.cardio,
                        weight: day.weight,
                        notes: e.target.value === "" ? null : e.target.value,
                        checkpointId: day.checkpointId,
                      });
                      setCurrentIndex(index);
                      setCurrentType("notes");
                      setIsLoading(true);
                      await setNotes(
                        day.date,
                        day.programId,
                        e.target.value,
                        day.notes!
                      );
                      setIsLoading(false);
                    }}
                    placeholder="digite aqui como foi seu dia..."
                    defaultValue={day.notes!}
                    className="min-h-[120px] text-muted-foreground placeholder:text-gray-300 bg-[#fffee2] bg-gray-100 bg-opacity-25"
                  ></Textarea>
                  <PopoverClose className="pt-2">
                    <Button
                      variant="secondary"
                      className="text-muted-foreground shadow-md"
                    >
                      Salvar
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </>
  );
}
