import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      <div className="hidden sm:inline-block">BLOG-AI</div>
      <FontAwesomeIcon
        icon={faBrain}
        className="text-4xl animate-pulse sm:animate-none sm:text-2xl text-slate-400 hover:text-slate-100 hover:animate-none"
      />
    </div>
  );
};
export default Logo;
