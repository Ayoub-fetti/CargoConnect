import CompanySidebar from "../../../components/layout/CompanySidebar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
