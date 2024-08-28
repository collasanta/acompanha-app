"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DietAutomationRun {
  id: string;
  createdAt: string;
  clientId: string;
  clientName: string;
  dietId: string;
  dietName: string;
  clientClonedDietId: string;
  receivedResponses: string;
}

interface DietAutomationRunsProps {
  runs: DietAutomationRun[];
}

export default function DietAutomationRuns({ runs }: DietAutomationRunsProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatReceivedResponses = (responses: string) => {
    try {
      const parsed = JSON.parse(responses);
      return (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(parsed).map(([key, value]) => (
            <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">{key}:</span>
              <span className="ml-2 text-gray-600">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <div className="text-red-500">Erro ao processar respostas</div>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Execuções</CardTitle>
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Total: {runs.length}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold w-1/4">Data</TableHead>
                <TableHead className="font-semibold w-1/4">Cliente</TableHead>
                <TableHead className="font-semibold w-1/4">
                  Dieta Atribuída
                </TableHead>
                <TableHead className="font-semibold w-1/4">Respostas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run, index) => (
                <React.Fragment key={run.id}>
                  <TableRow className="border-b border-gray-100">
                    <TableCell className="py-2">
                      {new Date(run.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2">
                      <Link
                        href={`/clients/${run.clientId}`}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        prefetch={index < 3}
                      >
                        {run.clientName}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </Link>
                    </TableCell>
                    <TableCell className="py-2">
                      <Link
                        href={`/diets/${run.clientClonedDietId}`}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        prefetch={index < 3}
                      >
                        {run.dietName}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </Link>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(run.id)}
                          className="p-0"
                        >
                          {expandedRows[run.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm">
                          {expandedRows[run.id] ? "Ocultar" : "Ver"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows[run.id] && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-gray-50 p-6">
                        <div className="text-sm">
                          <h4 className="font-semibold mb-4 text-lg">
                            Detalhes das Respostas:
                          </h4>
                          {formatReceivedResponses(run.receivedResponses)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
