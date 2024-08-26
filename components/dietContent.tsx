// components/diet-content.tsx
import React from "react";
import ViewOnlyEditor from "./block-editor-view-only";

export default function DietContent({ content }: { content: string }) {
  return <ViewOnlyEditor content={content} />;
}
