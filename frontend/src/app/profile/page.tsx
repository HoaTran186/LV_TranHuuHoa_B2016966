import Profile from "@/components/Profile/Profile";
import { cookies } from "next/headers";
import Link from "next/link";

export default function ProfilePage() {
  const cookie = cookies().get("Token")?.value;
  if (cookie == null) {
    return (
      <div>
        Bạn chưa vui lòng
        <Link href={"/login"} className="hover:text-teal-500">
          Đăng nhập
        </Link>
        để thực hiện chức năng này!
      </div>
    );
  } else {
    return (
      <div>
        <Profile Token={cookie} />
      </div>
    );
  }
}
