import Cart from "@/components/Cart/cart";
import { cookies } from "next/headers";

export default function CartPage() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <Cart accessToken={cookie} />
    </div>
  );
}
