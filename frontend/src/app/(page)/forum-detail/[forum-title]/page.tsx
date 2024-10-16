import ForumDetail from "@/components/forum/ForumDetail";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <ForumDetail Token={cookie} />
    </div>
  );
}
