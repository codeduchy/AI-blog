import Image from "next/image";
import Logo from "../components/Logo/Logo";
import Link from "next/link";
import HeroImage from "../public/hero.webp";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} fill alt="hero" className="absolute" />
      <div>
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
