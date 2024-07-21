import Hero from "@/components/Hero/Hero";
import UserLayout from "@/components/Layout/UserLayout";
import Image from "next/image";

export default function Home() {
  return (
    <UserLayout>
      <Hero/>
    </UserLayout>
  );
}
