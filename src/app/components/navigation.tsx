import Link from "next/link";

export const Navigation = () => {
    return (
        <nav>
            <Link href="/" className="text-blue-500 mr-4 mt-4">
                Home
            </Link>
            <Link href="/" className="text-blue-500  mr-4 mt-5">
                About
            </Link>
            <Link href="/" className="text-blue-500 mr-4 mt-5">
                Product 1
            </Link>
        </nav>
    );
}