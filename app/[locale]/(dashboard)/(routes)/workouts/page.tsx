import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "@/i18n/routing";
import { getWorkoutPlansByProfessional } from "@/lib/workouts";
import WorkoutCard from "@/components/workoutCard";
import { Button } from "@/components/ui/button";
import { WorkoutPlanType } from "@/types/workouts";

const WorkoutsPage = async () => {
  const { error, workoutPlans } = await getWorkoutPlansByProfessional();

  if (error) {
    toast.error("Erro ao carregar treinos: " + error.error);
    return null;
  }

  return (
    <div className="pb-[100px]">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">Treinos</h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Biblioteca de Treinos
        </p>
      </div>
      <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
        <Link href="/workouts/register">
          <Button className="p-4 flex shadow-md">
            <PlusIcon className="w-6 h-6 pr-2" />
            Cadastrar Novo Treino
          </Button>
        </Link>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 pt-8 mx-auto flex flex-col justify-center md:min-w-[400px]">
        {workoutPlans &&
          workoutPlans.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
      </div>
    </div>
  );
};

export default WorkoutsPage;
