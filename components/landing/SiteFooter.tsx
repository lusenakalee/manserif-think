import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/manserif.think/";
const EMAIL_URL = "mailto:warren@manserifthink.com";

const QUICK_LINKS = [
  { label: "Art exhibition", href: "/art-exhibition" },
  { label: "Communion", href: "/communion" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: EMAIL_URL },
];

export default function SiteFooter() {
  return (
   <footer className="bg-black dark:bg-gray-900 text-white">
  <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div>
        <Link href="/" className="inline-flex items-center gap-3 text-white">
          <Image
            src="/images/manserif-man.png"
            alt=""
            width={576}
            height={576}
            className="h-16 w-16 object-contain invert"
          />
          <span className="text-xl font-semibold tracking-tight">
            Manserif.Think
          </span>
        </Link>
      
        <p className=" font-happy text-2xl mt-4 max-w-xs text-gray-400">
          Multidisciplinary artist sharing evolving work.
        </p>

        <ul className="mt-8 flex gap-6">
          <li>
            <a
              href={INSTAGRAM_URL}
              rel="noreferrer noopener"
              target="_blank"
              className="text-white transition hover:opacity-75"
            >
              <span className="sr-only">Instagram</span>

              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              href={EMAIL_URL}
              className="text-white transition hover:opacity-75"
            >
              <span className="sr-only">Email</span>
              <Mail className="size-6" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <div className="lg:col-span-2 lg:flex lg:justify-end">
        <div>
          <p className="font-medium text-white">Quick links</p>

          <ul className="mt-6 space-y-4 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("mailto:") ? (
                  <a
                    href={link.href}
                    className="text-white transition hover:opacity-75"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-white transition hover:opacity-75"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <p className="text-xs text-gray-400">
      &copy; {new Date().getFullYear()} Manserif.Think. All rights reserved.
    </p>
  </div>
</footer>
  )
}