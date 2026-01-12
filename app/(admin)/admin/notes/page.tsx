import { getNotes } from "./actions";
import DeleteButton from "./delete-button"; // Import tombol delete yang baru
import AddNoteForm from "./add-note-form"; // Import form yang baru dibuat
import { Calendar } from "lucide-react";

// Server Component (Async)
export default async function NotesPage() {
  // 1. Fetch data langsung di server
  const notes = await getNotes();

  return (
    <div className="min-h-screen bg-warm-bg/50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-coffee tracking-tight mb-2">
            Catatan <span className="text-gold-accent">Admin</span>.
          </h1>
          <p className="text-gray-500">
            Kelola ide konten, to-do list, dan catatan penting lainnya.
          </p>
        </div>

        {/* Layout Grid: Form di Kiri (Desktop) / Atas (Mobile), List di Kanan/Bawah */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom 1: Form Input */}
          <div className="lg:col-span-1">
            <div className="sticky top-10">
              <AddNoteForm />
            </div>
          </div>

          {/* Kolom 2: List Catatan */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-coffee text-lg">
                Daftar Catatan <span className="text-gray-400 font-normal text-sm ml-2">({notes.length})</span>
              </h3>
            </div>

            {notes.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-bold text-coffee mb-1">Belum ada catatan</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Mulai tulis ide brilianmu sekarang melalui formulir di samping.
                </p>
              </div>
            ) : (
              // Notes Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-accent/30 transition-all duration-300 flex flex-col"
                  >
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-coffee text-lg leading-tight line-clamp-1 group-hover:text-gold-accent transition-colors">
                        {note.title}
                      </h3>
                      {/* Tombol Delete Component */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                         <DeleteButton noteId={note.id} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-6">
                        {note.content}
                      </p>
                    </div>

                    {/* Footer Date */}
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-auto">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString("id-ID", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}