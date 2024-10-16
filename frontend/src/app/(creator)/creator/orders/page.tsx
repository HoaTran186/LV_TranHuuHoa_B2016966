import TableOrders from "@/components/Creator/TableOrders";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mt-28 mx-10 ">
      <TableOrders Token={cookie} />
    </div>
  );
}
