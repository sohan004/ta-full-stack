import Link from "next/link";

const NotFountPage = () => {
    return (
        <div className='relative'>
            <div className="bg-gradient-to-r from-blue-950 to-blue-700  blur-[90px] absolute top-1/2 -translate-y-1/2 rounded-full  w-full  h-[50%] opacity-40 scale-110 ">
            </div>
            <main className="h-screen w-full flex flex-col justify-center items-center ">
                <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">404</h1>
                <div className="bg-gradient-to-r from-primary to-secondary text-black bg-white px-2 text-sm rounded rotate-12 absolute">
                    Page Not Found
                </div>
                <button className="mt-5">
                    <Link
                        href={'/'}
                        className="relative inline-block text-sm font-medium  group bg-gradient-to-r from-blue-400 hover:scale-105 duration-150 to-blue-900 text-white rounded "
                    >
                        <span className="relative block px-8 py-3  ">
                            <span>Go Home</span>
                        </span>
                    </Link>
                </button>
            </main>
        </div>
    );
};

export default NotFountPage;