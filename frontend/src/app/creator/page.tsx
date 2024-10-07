import UploadProduct from "@/components/Creator/UploadProduct";
import { cookies } from "next/headers";

export default function CreatorPage() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <UploadProduct Token={cookie} />
    </div>
  );
}
