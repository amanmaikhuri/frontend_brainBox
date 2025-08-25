import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import RateLimitedUI from "../components/RateLimitedUI"
import toast from "react-hot-toast";
import { LoaderIcon } from "lucide-react";
import Notecard from "../components/Notecard";
import NoteNotFound from "../components/NotesNotFound";
import api from "../lib/axios";

const HomePage = () => {
  const [isRateLimited, setIsRateLImited]= useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLImited(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if(error.response?.status === 429){
          setIsRateLImited(true);
        } else {
          toast.error("An error occurred while fetching notes.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [])
  
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && 
          <div className="text-center text-primary py-10">
            <LoaderIcon className="inline size-5 mr-2 animate-spin"/>
            Loading Notes...
          </div>}

        {!loading && notes.length === 0 && <NoteNotFound />
        // <div className="text-center text-primary py-10">
        //   No notes available. Create a new note to get started!
        // </div>}
}
        
          {notes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Notecard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          )}
        </div>
      </div>
  )
}
export default HomePage