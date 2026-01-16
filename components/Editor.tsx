"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header"; 
import List from "@editorjs/list"; 
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";

interface EditorProps {
  data?: any;
  onChange: (data: any) => void;
  holder: string;
}

export default function Editor({ data, onChange, holder }: EditorProps) {
  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: { 
          header: {
            // 👇 TAMBAHKAN 'as any' DISINI UNTUK FIX ERROR
            class: Header as any, 
            config: {
              placeholder: 'Masukkan Judul...',
              levels: [2, 3, 4],
              defaultLevel: 2
            }
          }, 
          list: {
            // 👇 TAMBAHKAN 'as any' JUGA DISINI BIAR AMAN
            class: List as any, 
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          // 👇 Daftarkan Table Tool Disini
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: {
              rows: 2, // Baris default saat insert
              cols: 3, // Kolom default saat insert
            },
          },
          // Tool Embed (Youtube, Twitter, IG, dll)
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                coub: true,
                twitter: true,
                instagram: true, // Kadang perlu API Key meta facebook kalau IG
              },
            },
          },

          // Tool Image (Upload ke API kita tadi)
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                // Arahkan ke API Route yang baru kita buat di langkah no 2
                byFile: '/api/editor/upload', 
              },
              field: 'image', // Nama field form data
            },
          },
        },
        data: data,
        placeholder: 'Mulai tulis ceritamu disini...',
        async onChange(api, event) {
          const content = await api.saver.save();
          onChange(content);
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div 
      id={holder} 
      className="prose max-w-none min-h-[300px] border border-gray-300 p-4 rounded-xl bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all" 
    />
  );
}