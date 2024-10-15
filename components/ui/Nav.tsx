import Link from "next/link";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { PiCertificateBold } from "react-icons/pi";
import { ImQuotesLeft } from "react-icons/im";

const MobileNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-md z-30">
      <div className="flex justify-around py-3">
        <Link href="/ruang-bincang" className="flex flex-col items-center text-bluetiful hover:text-gray-700">
          <IoChatboxEllipses size={32} />
        </Link>

        {/* <Link href="/search" className="flex flex-col items-center text-bluetiful hover:text-gray-700">
          <IoSearch size={32} />
        </Link> */}

        <Link href="/duta" className="flex flex-col items-center text-bluetiful hover:text-gray-700">
          <IoPeopleCircleOutline size={32} />
        </Link>

        <Link href="/gelar" className="flex flex-col items-center text-bluetiful hover:text-gray-700">
          <PiCertificateBold size={32} />
        </Link>

        <Link href="/quotes" className="flex flex-col items-center text-bluetiful hover:text-gray-700">
          <ImQuotesLeft size={32} />
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
