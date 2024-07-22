import Hero from "@/components/Landing/Hero/Hero";
import UserLayout from "@/components/Layout/UserLayout";
import Main from "@/components/Landing/Main/Main";
import Image from "next/image";
import Feature from "@/components/Landing/Features/Feature";

export default function Home() {
  return (
    <UserLayout>
      <Hero />
      <Main />
      <Feature/>
    </UserLayout>
  );
}
