import TableForum from "@/components/Admin/TableForum";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-3">
      <TableForum Token={cookie} />
    </div>
  );
}
