import { Button } from "@/components/ui/Button";
import { programsFrontEndListType } from "@/types/programs";
import { PlusIcon } from "lucide-react";
import { ProgramCard } from "@/components/programCard";
import { getUserPrograms } from "@/lib/programs";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
redirect("/clients");
}

export default Dashboard;