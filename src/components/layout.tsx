import {
  BuildingLibraryIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";

function Header() {
  return (
    <header className="p-10">
      <div className="hidden sm:flex w-full justify-between space-x-8 max-w-[1280] justify-self-center">
        <div className="content-end">
          <div className="font-title text-gray-500 py-2 px-3 rounded-md bg-gray-200">
            Day 1
          </div>
        </div>
        <Link href="/" className="items-center flex flex-col text-gray-500">
          <BuildingLibraryIcon aria-hidden="true" className="size-8" />
          <span className="font-extrabold text-2xl">HowsTrumpDoing</span>
          <span className="font-title">
            Chronicling the Trump Presidency One Act At a Time
          </span>
        </Link>
        <div className="content-end font-medium text-sm text-gray-500">
          <Link href={"/mission"}>Mission</Link>
        </div>
      </div>

      {/* Layout on Mobile is fundamentally different, show on mobile and hide this section on desktop. */}
      <div className="flex sm:hidden flex-col space-y-4">
        <Link
          href="/"
          className="items-center text-center flex flex-col text-gray-500"
        >
          <BuildingLibraryIcon aria-hidden="true" className="size-8" />
          <span className="font-extrabold text-2xl">HowsTrumpDoing</span>
          <span className="font-title">
            Chronicling the Trump Presidency One Act At a Time
          </span>
        </Link>
        <div className="flex justify-between">
          <div className="content-center">
            <div className="font-title text-gray-500 py-2 px-3 rounded-md bg-gray-200">
              Day 1
            </div>
          </div>
          <div className="content-center font-medium text-sm text-gray-500">
            <Link href={"/mission"}>Mission</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="p-10 pb-20 lg:h-56 bg-gray-50 border-t border-gray-500">
      <div className="flex flex-col md:flex-row w-full justify-between space-y-8 md:space-y-0 md:space-x-8 max-w-[1280] justify-self-center">
        <span className="font-extrabold text-2xl text-gray-500">
          Citizen Journalism In Action
        </span>
        <p className="body-m text-gray-500">
          This platform is dedicated to unbiased, independent analysis of the
          presidency&apos;s decisions, laws, and their impact on political and
          economic indicators. It&apos;s driven by the belief that informed
          citizens create stronger democracies. Join our online community to
          contribute, discuss, and support the effort to keep this resource
          alive.
        </p>
        <div className="flex flex-col space-y-2 items-center md:items-end">
          <div className="font-title p-3 rounded-md bg-gray-200 whitespace-nowrap flex flex-row space-x-1">
            {/* TODO(sathyp): Leverage Discord Icon here and link to Discord server */}
            <ChatBubbleLeftIcon aria-hidden="true" className="size-4" />
            <span>Join Our Discord Community</span>
          </div>
          <span className="body-s text-gray-900 whitespace-nowrap text-end">
            © HowsTrumpDoing, 2024
          </span>
        </div>
      </div>
    </footer>
  );
}

interface Props {
  title: string;
  children: React.ReactNode;
}

export function Layout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">{children}</main>

        <Footer />
      </div>
    </>
  );
}
