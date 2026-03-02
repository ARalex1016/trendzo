// Components
import { LoaderFive } from "./ui/loader";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="w-full flex justify-center pt-10">
      <LoaderFive text={text} />
    </div>
  );
};

export default Loader;
