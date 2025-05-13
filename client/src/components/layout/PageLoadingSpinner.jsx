import { HashLoader } from "react-spinners";

function PageLoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <HashLoader color="#6875F5" size={40} />
    </div>
  );
}

export default PageLoadingSpinner;
