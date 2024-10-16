import MyForumId from "@/components/forum/MyForumId";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <MyForumId Token={cookie} />
    </div>
  );
}
