import Image from "next/image";
import HeroImage from "../public/hero.webp";
import Logo from "../components/Logo/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative bg-gradient-to-br from-slate-900 to-slate-800">
      {/* <Image src={HeroImage} alt="hero" className="absolute" fill /> */}
      <div className="z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          AI-powered SAAS solution to generate SEO-optimized blog posts. Get
          high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn">
          Begin
        </Link>
      </div>
    </div>
  );
}
