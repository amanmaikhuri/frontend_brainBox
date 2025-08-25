import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error detected", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if(!note.title.trim() || !note.content.trim()){
      toast.error("Please add a title or content");
      return;
    }
    setSaving(true);
    try{
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch(error){ 
      toast.error("Error while updating your note");
      console.error("Error detected: ",error);
    } finally{
      setSaving(false);
    }
  }

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error("Failed to fetch note:", error);
        toast.error("Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header with back and delete */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="size-5 mr-2" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="size-5 mr-2" />
              Delete Note
            </button>
          </div>

          {/* Note details */}
          <div className="card bg-base-100">
            <div className="card-body">
              {/* Title */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text py-1">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input input-bordered"
                  value={note?.title || ""} // ✅ safe access
                  onChange={(e) =>
                    setNote({ ...note, title: e.target.value })
                  }
                />
              </div>

              {/* Content */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text py-1">Content</span>
                </label>
                <textarea
                  placeholder="Note Content"
                  className="textarea textarea-bordered h-40"
                  value={note?.content || ""} // ✅ correct field
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="card-actions justify-end">
                  <button className="btn btn-primary" disabled={saving}onClick={handleSave}>
                    {saving ? "Saving...": "Save Changes"}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
