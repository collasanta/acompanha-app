import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ViewOnlyEditor = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: JSON.parse(content),
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default ViewOnlyEditor;
