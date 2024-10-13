import UploadProduct from "@/components/Creator/UploadProduct";
import { cookies } from "next/headers";
import Link from "next/link";

export default function page() {
  const cookie = cookies().get("Token")?.value;
  if (cookie == null) {
    return (
      <div className="text-center mx-52 rounded-3xl h-40 items-center border-2 mt-36 my-6 pt-14 text-2xl">
        Vui lòng{" "}
        <Link href={"/login"} className="hover:text-teal-500">
          Đăng nhập
        </Link>{" "}
        để được sử dụng chức năng !!
      </div>
    );
  } else {
    return (
      <div>
        <UploadProduct Token={cookie} />
      </div>
    );
  }
}
