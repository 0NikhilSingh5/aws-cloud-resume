/**
 * Slim, theme-aware footer strip. Renders just a subtle border-top divider
 * + a single line of copyright / contact info — designed to sit inside the
 * Contact panel on the home page, or as the closing element of a long
 * subpage. Intentionally minimal: no menu trees, no sub-links, no logo.
 */
export function MiniFooter() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-current/20 pt-6 text-xs font-medium uppercase tracking-[0.15em] opacity-60">
      <span>© {year} Nikhil Singh</span>
      <span className="hidden md:inline">Cloud Engineer · India</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <a
          href="mailto:0nikhilsingh5@gmail.com"
          className="transition hover:opacity-100"
        >
          0nikhilsingh5@gmail.com
        </a>
        <a
          href="tel:+919027500166"
          className="transition hover:opacity-100"
        >
          +91 902 750 0166
        </a>
      </div>
    </div>
  );
}
