import Chat from "@/components/Chat";
import ChatPrivate from "@/components/ChatPrivate";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <Chat Token={cookie} />
    </div>
  );
}
