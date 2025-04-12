import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Rooms() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  const [roomCode, setRoomCode] = useState("");
  const [joinedRooms, setJoinedRooms] = useState([]);

  const fetchJoinedRooms = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/classrooms/student?student_id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setJoinedRooms(data.classrooms || []);
      } else {
        console.error("Fetch failed:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchJoinedRooms();
  }, []);

  const joinRoom = async () => {
    if (!roomCode) return alert("Please enter a room code.");
    if (!user?.id) return alert("User not found.");

    try {
      const response = await fetch('/api/classrooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully joined the room!");
        setRoomCode(""); // reset input
        fetchJoinedRooms(); // refresh list
      } else {
        alert(data.error || "Failed to join room.");
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Something went wrong.");
    }
  };

  const openRoom = (id: number) => {
    router.push(`/classroom/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-2">
        <Input 
          placeholder="Enter room code..." 
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="flex-grow"
        />
        <Button size="sm" onClick={joinRoom}>Join</Button>
      </div>

      <h4 className="text-sm font-medium mb-2">Joined Rooms</h4>

      <div className="space-y-3">
        {joinedRooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-primary/5 transition-colors">
            <div className="flex items-center space-x-3">
              <DoorOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{room.name}</p>
                <p className="text-xs text-muted-foreground">{room.subject}</p>
              </div>
            </div>
            <Link href={`/classroom/${room.id}`}><Button variant="outline" size="sm">Open</Button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
