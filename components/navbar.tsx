import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";

const Navbar = async () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end min-h-[33px]">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;