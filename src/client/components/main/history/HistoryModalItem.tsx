export default function HistoryModalItem({ srcText, targetText }) {
  return (
    <div className="HoverOff hover:bg-enabled w-full p-2 bg-white bg-opacity-75 border-t-2 border-b-2 border-zinc-300 flex-col justify-start items-start inline-flex">
      <div className="srcTextAreatext-center text-gray-900 text-xs font-normal font-sans leading-normal">
        {srcText}
      </div>

      <div className="targetTextarea text-center text-gray-900 text-base font-normal font-sans">
        {targetText}
      </div>
    </div>
  );
}
