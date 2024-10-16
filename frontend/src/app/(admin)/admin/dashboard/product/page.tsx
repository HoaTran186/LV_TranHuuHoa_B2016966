import TableProduct from "@/components/Admin/TableProduct";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-3">
      <TableProduct Token={cookie} />
    </div>
  );
}
