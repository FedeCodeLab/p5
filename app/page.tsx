import AnimatedBackground from "@/components/animatedBackground";
import { Certificates } from "@/components/certificates";
import { Stack } from "@/components/Stack/indrex";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="relative">
      <AnimatedBackground />

      <div className="font-sans py-12 mx-auto w-[85%] border-2 border-[#707070] relative z-50">
        <main className="mx-auto p-4 flex flex-col gap-4">
          <Navbar />
          <Hero />
          <Projects />
          <Certificates />
          <Stack />
          <Footer />
        </main>
        <footer className=""></footer>
      </div>
    </div>
  );
}
