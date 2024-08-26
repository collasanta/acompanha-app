// components/diet-content.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import ViewOnlyEditor from "./block-editor-view-only";

export default function DietContent({ content }: { content: string }) {
  return <ViewOnlyEditor content={content} />;
}
