import { ModeToggle } from "@/components/theme-provider/ModeToggle";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="h-16 text-2xl w-full p-1 flex items-center fixed top-0 left-0 backdrop-blur-xs">
            <ul className="h-full flex grow items-center px-6 gap-4">
                <li className="mr-[auto]">
                    <Link href="/">Websockets for Top.gg</Link>
                </li>

                <li>
                    <ModeToggle />
                </li>
            </ul>
        </nav>
    );
}