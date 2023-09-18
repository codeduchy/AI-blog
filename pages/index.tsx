import Image from "next/image";
import Logo from "../components/Logo/Logo";
import Link from "next/link";
import HeroImage from "../public/hero.webp";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} fill alt="hero" className="absolute" />
      <div className="z-10 bg-slate-900/90 text-white px-10 py-5 text-center max-w-screen-sm rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn">
          Begin
        </Link>
      </div>
    </div>
  );
}
