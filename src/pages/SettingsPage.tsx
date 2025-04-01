
import { NavBar } from "@/components/NavBar";
import Header from "@/components/Header";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-catalog-manila pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-catalog-teal mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6 border border-catalog-softBrown/20">
          <p className="text-gray-500 italic">Settings page content will go here.</p>
        </div>
      </main>
      <NavBar />
    </div>
  );
};

export default SettingsPage;
