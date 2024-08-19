import React from 'react';
import { getClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MailIcon, PhoneIcon, InfoIcon } from 'lucide-react';

export default async function ProgramPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;

  const client = await getClient(clientId);

  if ('error' in client) {
    toast.error("Erro ao carregar cliente: " + client.error);
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Perfil do Cliente</h1>
      <p className="text-muted-foreground text-center mb-8">Informações detalhadas do cliente</p>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl mb-1">{client.name}</CardTitle>
            <CardDescription>Cliente desde {client.createdAt.toLocaleDateString("pt-BR")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <PhoneIcon className="text-muted-foreground" />
              <span>{client.whatsapp || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="text-muted-foreground" />
              <span>{client.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>Atualizado em: {client.updatedAt.toLocaleDateString("pt-BR")} às {client.updatedAt.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{client.genre || 'Gênero não especificado'}</Badge>
              <Badge variant="outline">{client.age ? `${client.age} anos` : 'Idade não especificada'}</Badge>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground" />
                Informações Adicionais
              </h3>
              <p className="text-muted-foreground">{client.info || 'Nenhuma informação adicional disponível.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}