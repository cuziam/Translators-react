import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
  return (
    <div className="w-full min-w-96 h-8 px-4 border-b border-zinc-300 justify-between items-center inline-flex">
      <Logo />
      <HeaderMenu />
    </div>
  );
}
