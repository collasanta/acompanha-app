import { Button } from "@/components/ui/button";
import { programsFrontEndListType } from "@/types/programs";
import { PlusIcon } from "lucide-react";
import { ProgramCard } from "@/components/programCard";
import { getUserPrograms } from "@/lib/programs";
import toast from "react-hot-toast";
import { Link, redirect } from "@/i18n/routing";

const Dashboard = async () => {
  redirect("/clients");
};

export default Dashboard;
