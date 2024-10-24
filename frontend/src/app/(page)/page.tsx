import Comments from "@/components/Home/Comment";
import NewProduct from "@/components/Home/NewProduct";
import Search from "@/components/Home/Search";
import Suggested from "@/components/Home/Suggested";
import { cookies } from "next/headers";

export default function HomePage() {
  const cookie = cookies().get("Token")?.value;
  return (
    <div>
      <div className="flex flex-col">
        <div className="bg-gray-100 w-full flex flex-col justify-center items-center">
          <div className="relative w-screen max-w-[84rem] mx-4">
            <video
              className="rounded-3xl shadow-lg"
              src="/images/video/background-video.mp4"
              autoPlay
              loop
              muted
            />
            <Search />
          </div>
        </div>
        <div className="mt-52">
          <Suggested />
          <NewProduct Token={cookie} />
        </div>
        <Comments />
      </div>
    </div>
  );
}
