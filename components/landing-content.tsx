"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Nutricionistas",
    avatar: "A",
    title: "Designer",
    description: "Acompanhe o progresso dos seus pacientes de forma única, e automatize os processos de atendimento ",
  },
  {
    name: "Pacientes",
    avatar: "J",
    title: "Software Engineer",
    description: "Tenha um acompanhamento diário do seu progresso, e receba feedbacks do seu profissional de saúde",
  },
  {
    name: "Entusiastas",
    avatar: "M",
    title: "CEO",
    description: "Registre sua evolução nos treinos, dietas e peso, e tenha um histórico completo do seu progresso",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20 bg-white">
      <h2 className="text-center text-3xl text-white font-extrabold mb-10 text-gray-500 pt-8">Feito para:</h2>
      <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-gradient-to-r from-cyan-500 shadow-lg to-emerald-600 border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}