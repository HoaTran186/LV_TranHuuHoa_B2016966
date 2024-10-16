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
      <section>{children}</section>
      <Footer />
    </div>
  );
}
