import Hero from "@/components/Landing/Hero/Hero";
import UserLayout from "@/components/Layout/UserLayout";
import Main from "@/components/Landing/Main/Main";
import Image from "next/image";
import Feature from "@/components/Landing/Features/Feature";
import Plans from "@/components/Landing/Plans/Plans";
import CTA from "@/components/Landing/CTA/CTA";
import Footer from "@/components/Landing/Footer/Footer";
import LandingComponent from "@/components/LandingN/LandingComponent";

export default function Home() {
  return (
    <LandingComponent/>
    // <UserLayout>
    //   <Hero />
    //   <Main />
    //   <Feature/>
    //   <Plans/>
    //   <CTA/>
    //   <Footer/>
    // </UserLayout>
  );
}
