export default function ClientMessage({ message }) {
  return (
    <div className="flex justify-start mb-4">
      <img
        src="images/logo.png"
        className="object-cover h-8 w-8 rounded-full bg-disabled"
        alt=""
      />
      <div className="ml-2 py-2 px-3 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white text-start">
        {message}
      </div>
    </div>
  );
}
