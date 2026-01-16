import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

export const EDITOR_TOOLS: { [toolName: string]: ToolConstructable | ToolSettings } = {
  header: {
    // Cast ke ToolConstructable jika library tidak memiliki tipe yang akurat
    class: Header as unknown as ToolConstructable, 
    config: {
      placeholder: 'Masukkan Judul...',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List as unknown as ToolConstructable,
    inlineToolbar: true,
    config: { defaultStyle: 'unordered' },
  },
  table: {
    // 👇 FIX: Type assertion untuk bypass strict constructor mismatch
    class: Table as unknown as ToolConstructable,
    inlineToolbar: true,
    config: { 
      rows: 2, 
      cols: 3 
    },
  },
  embed: {
    class: Embed as unknown as ToolConstructable,
    config: {
      services: {
        youtube: true,
        twitter: true,
        instagram: true,
      },
    },
  },
  image: {
    class: ImageTool as unknown as ToolConstructable,
    config: {
      endpoints: {
        byFile: '/api/editor/upload',
      },
      field: 'image',
    },
  },
};