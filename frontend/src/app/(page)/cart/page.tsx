import Cart from "@/components/Cart/cart";
import { cookies } from "next/headers";
import Link from "next/link";

export default function CartPage() {
  const cookie = cookies().get("Token")?.value;
  if (cookie == null) {
    return (
      <div>
        Go <Link href={"/login"}>Đăng nhập</Link>
      </div>
    );
  } else {
    return (
      <div>
        <Cart Token={cookie} />
      </div>
    );
  }
}
