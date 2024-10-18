import SearchBar from "@/components/Product/SearchBar";
import { cookies } from "next/headers";

export default function ProductsPage() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="mx-32">
      <SearchBar Token={cookie} />
    </div>
  );
}
