import LoginAdmin from "@/components/Admin/LoginAdmin";
import LogoutButton from "@/components/Login/LogoutButton";
import { cookies } from "next/headers";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  if (cookie == null) {
    return (
      <div>
        <LoginAdmin />
      </div>
    );
  } else {
    return <LogoutButton />;
  }
}
