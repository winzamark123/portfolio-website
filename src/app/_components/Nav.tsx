import { ModeToggle } from './ModeToggle';

export default function Nav() {
  return (
    <nav className="fixed m-5">
      <ModeToggle />
      <li>Home</li>
      <li>Temp</li>
      <li>About</li>
    </nav>
  );
}
