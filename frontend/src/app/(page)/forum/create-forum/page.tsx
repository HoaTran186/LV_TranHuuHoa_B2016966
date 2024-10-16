import CreateForum from "@/components/forum/CreateForum";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <CreateForum Token={cookie} />
    </div>
  );
}
