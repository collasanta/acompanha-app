export default function ProgramPage({
  params: { programId },
}: {
  params: { programId: string }
}) {
  return (
    <div className="h-full text-white">
      Teste {programId}
    </div>
  );
}

