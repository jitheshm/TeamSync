import UserLayout from "@/components/Layout/UserLayout";
import Image from "next/image";

export default function Home() {
  return (
    <UserLayout>
      <div className="h-screen bg-white pt-24">
        <h4 className="text-gray-950"> Welcome to home page</h4>
      </div>
    </UserLayout>
  );
}
