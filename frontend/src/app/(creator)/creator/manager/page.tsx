import ManagerOrder from "@/components/Creator/ManagerOrder";
import { cookies } from "next/headers";

export default async function page() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-10">
      {" "}
      <ManagerOrder Token={cookie} />
    </div>
  );
}
