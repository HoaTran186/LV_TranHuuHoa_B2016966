import Footer from "@/components/Home/Footer";
import NavBar from "@/components/Home/NavBar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <div className="mt-32 mb-3">{children}</div>
      <Footer />
    </div>
  );
}
