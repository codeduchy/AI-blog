import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading h-20">
      <span className="hidden sm:inline-block">Blog-ai</span>
      <FontAwesomeIcon
        icon={faBrain}
        className="animate-pulse sm:animate-none sm:hover:text-slate-400 transition-all ease-in-out w-full h-full text-slate-400 hover:text-slate-100 sm:w-auto sm:max-h-7 sm:inline-block text-4xl max-h 
      "
      />
    </div>
  );
};
export default Logo;
