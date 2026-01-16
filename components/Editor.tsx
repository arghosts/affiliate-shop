"use client";

import React, { useEffect, useRef, memo } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "@/config/editor-tools";
import { cn } from "@/lib/utils"; // Asumsi utility class merge

interface EditorProps {
  data?: OutputData; // Gunakan tipe bawaan EditorJS, bukan 'any'
  onChange: (data: OutputData) => void;
  holder: string;
  readOnly?: boolean;
}

const Editor = ({ data, onChange, holder, readOnly = false }: EditorProps) => {
  // Ref untuk menyimpan instance EditorJS
  const editorRef = useRef<EditorJS | null>(null);
  // Ref untuk memastikan inisialisasi hanya terjadi sekali (React 18 Strict Mode fix)
  const isReady = useRef(false);

  useEffect(() => {
    // Guard clause: Jika sudah ready, jangan init ulang
    if (isReady.current) return;

    const initEditor = async () => {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: data || undefined,
        readOnly: readOnly,
        placeholder: "Mulai tulis ceritamu disini...",
        
        // Performance: Gunakan onReady untuk memastikan core loaded
        onReady: () => {
          console.log("Editor.js is ready to work!");
          isReady.current = true;
          editorRef.current = editor;
        },

        async onChange(api, _event) {
          try {
            const savedData = await api.saver.save();
            onChange(savedData);
          } catch (error) {
            console.error("Editor save failed:", error);
          }
        },
      });
    };

    initEditor();

    // Cleanup function
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        // Hapus instance hanya saat komponen benar-benar unmount
        // Note: Di React 18 dev mode, ini mungkin terpanggil cepat, 
        // tapi isReady ref kita menahan re-init yang tidak perlu.
        editorRef.current.destroy();
        editorRef.current = null;
        isReady.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // Dependency array kosong: EditorJS tidak didesain untuk re-render reaktif 
  // terhadap props 'data'. Update data eksternal harus via instance method render().

  return (
    <div
      id={holder}
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert",
        "min-h-[300px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all",
        "focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20",
        readOnly && "pointer-events-none opacity-75 bg-gray-50"
      )}
    />
  );
};

// Memoize untuk mencegah re-render yang tidak perlu dari parent
export default memo(Editor);