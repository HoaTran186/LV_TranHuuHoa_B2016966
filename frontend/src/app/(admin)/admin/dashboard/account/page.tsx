import TableAccount from "@/components/Admin/TableAccount";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-3">
      <TableAccount Token={cookie} />
    </div>
  );
}
