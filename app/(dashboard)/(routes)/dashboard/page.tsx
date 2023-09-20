/* eslint-disable @next/next/no-img-element */
"use client"
import Heading from "@/components/heading";

const DashboardPage = () => {

  return (
    <div>
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Dashboard
      </h2>
      <p className="text-muted-foreground font-light text-small md:text-lg text-center">
        Lorem Ipsum
      </p>
    </div>
    <div className="px-4 md:px-20 lg:px-32 space-y-4">
      Teste
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