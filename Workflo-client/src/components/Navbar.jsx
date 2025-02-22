import { ModeToggle } from "../components/ModeToggle";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full max-w-5xl">
      <h2 className="font-bold">Workflo</h2>

      <ModeToggle />
    </div>
  );
};

export default Navbar;
