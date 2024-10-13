import Chat from "@/components/Chat";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <Chat Token={cookie} />
    </div>
  );
}
