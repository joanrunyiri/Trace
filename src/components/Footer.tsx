"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
const pathname = usePathname();

// Hide footer on homepage (cinematic intro)
if (pathname === "/") return null;

return (
<motion.footer
className="w-full text-center py-8 text-[11px] tracking-wide opacity-70"
style={{ fontFamily: "'Inter', sans-serif" }}
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 1.2, ease: "easeOut" }}
>
<div className="space-y-2">
<p>Ovelia Tech Redefining Intelligent Systems.</p>

{/* All links now point to /legal */}
<div className="flex justify-center space-x-4 opacity-60">
<Link href="/legal" className="hover:opacity-100 transition">
Impressum
</Link>
<span>•</span>
<Link href="/legal" className="hover:opacity-100 transition">
Privacy Policy
</Link>
<span>•</span>
<Link href="/legal" className="hover:opacity-100 transition">
Terms
</Link>
<span>•</span>
<a
href="mailto:sayhello@ovelia.tech"
className="hover:opacity-100 transition"
>
Contact
</a>
</div>

<p className="opacity-50">
© {new Date().getFullYear()} Ovelia Tech — Berlin, Germany.
</p>
</div>
</motion.footer>
);
}