import TableProductType from "@/components/Admin/TableProductType";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-3">
      <TableProductType Token={cookie} />
    </div>
  );
}
