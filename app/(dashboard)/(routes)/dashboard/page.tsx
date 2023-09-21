/* eslint-disable @next/next/no-img-element */
"use client"
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  // const [chapters, setChapters] = useState<any>([]);
  // useEffect(() => {
  //   (async function () {
  //     try {
  //       const chaptersData:any = await getUserChapters();
  //       console.log("chaptersData", chaptersData);
  //       setChapters(chaptersData);
  //     } catch (error) {
  //       console.error('Error fetching chapters data:', error);
  //     }
  //   })();
  // }, []);
  
  return (
    <div>
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Programas
      </h2>
      <p className="text-muted-foreground font-light text-small md:text-lg text-center">
        Crie novos programas e acompanhe os antigos por aqui
      </p>
    </div>
    <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
      <Button 
        className="p-4 flex rounded-full shadow-md"
        onClick={() => {router.push('/cadastro')}}
      >
        <PlusIcon className="w-6 h-6 pr-2" / >
        <a> Adicionar Novo Programa </a>
      </Button>
      {/* <ChapterCard genId="asdasds" />
      {chapters.map((chapter:IChapterList) => (
        <ChapterCard 
        key={chapter.videoInfos.generationId}
        chapter={chapter}
        />
      ))} */}
    </div>
  </div>
  );
}

export default DashboardPage;