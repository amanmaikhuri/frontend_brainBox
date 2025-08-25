import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils.js";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const Notecard = ({note, setNotes}) => {

    const handleDelete = async (e,id)=> {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this note?")) return ;

        try {
            await api.delete(`/notes/${id}`);
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
            toast.success("Note deleted successfully");
        } catch (error) {
            console.error("Error detected",error);
            toast.error("Failed to delete note");
        }
    }
  return (
    <div>
        <Link to={`/note/${note._id}`} 
        className="card bg-base-300 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ff9d]">
            <div className="card-body">
                <h2 className="card-title text-base-content">{note.title}</h2>
                <p className="text-base-content/70 line-clamp-3">{note.content}</p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-sm text-base-content/60">
                        {formatDate(new Date(note.updatedAt))}
                    </span>
                    <div className="flex items-center gap-2">
                        <PenSquareIcon className="size-4" />
                        <button className="btn btn-ghost btn-xs text-error"
                        onClick={(e) => handleDelete(e, note._id)}>
                        <Trash2Icon className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
export default Notecard