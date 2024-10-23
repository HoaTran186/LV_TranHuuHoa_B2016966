import Chat from "@/components/Chat";
import ChatPrivate from "@/components/ChatPrivate";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <div>
        <h1>Chat Real-Time</h1>
        <Chat Token={cookie} />
      </div>
    </div>
  );
}
