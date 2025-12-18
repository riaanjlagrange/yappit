import { BeatLoader } from 'react-spinners';

function ContentLoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-start">
      <BeatLoader color="#6875F5" size={10} />
    </div>
  );
}

export default ContentLoadingSpinner;
