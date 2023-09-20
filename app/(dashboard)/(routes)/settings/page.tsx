const SettingsPage = async () => {

    return (
        <div>
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            Settings
          </h2>
          <p className="text-muted-foreground font-light text-small md:text-lg text-center">
            All your generations are saved here
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

export default SettingsPage;