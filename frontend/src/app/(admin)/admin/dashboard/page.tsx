import Announcements from "@/components/Admin/Announcements";
import CountChart from "@/components/Admin/CountChart";
import EventCalendar from "@/components/Admin/EventCalendar";
import FinanceChart from "@/components/Admin/FinanceChart";
import OrderChart from "@/components/Admin/OrderChart";
import UserCardAccount from "@/components/Admin/UseCardAccount";
import UserCardForum from "@/components/Admin/UseCardForum";
import UserCardOrder from "@/components/Admin/UseCardOrder";
import UserCardProduct from "@/components/Admin/UseCardProduct";
import { cookies } from "next/headers";

const AdminPage = () => {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCardProduct Token={cookie} />
          <UserCardAccount Token={cookie} />
          <UserCardOrder Token={cookie} />
          <UserCardForum Token={cookie} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart Token={cookie} />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <OrderChart Token={cookie} />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
