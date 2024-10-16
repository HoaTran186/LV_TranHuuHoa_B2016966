import MyForum from "@/components/forum/MyForum";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <MyForum Token={cookie} />
    </div>
  );
}
