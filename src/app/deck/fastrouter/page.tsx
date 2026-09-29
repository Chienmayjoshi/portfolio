import SlidesDeck from "@/components/fastrouter-slides/SlidesDeck";

// The shareable link for the FastRouter deck — the URL sent to a specific
// person rather than the one the portfolio links to.
//
// Same deck as /fastrouter-slides, with every route out of it removed:
// SlidesDeck's "share" variant drops the read-next card (a link to /analytics
// that also navigated there on a 6s timer with no click at all), and
// Header.tsx renders a chromeless header on this "/deck" prefix — no back
// link, no wordmark, no site nav, no mobile menu. Only the theme toggle, which
// navigates nowhere.
//
// Deliberately NOT access-controlled. Nothing here is secret: the same case
// study is public at /fastrouter-slides and linked from the homepage, so a
// code on this route would gate a door that stands wide open next to it. What
// this route provides is a reading experience with no exits and no cross-sell,
// not privacy. Someone who edits the URL reaches the rest of the portfolio,
// which is expected and fine.
//
// The layout's noindex is what keeps it out of search — a nav-less deck is not
// what should surface for a search of someone's name.
export default function FastRouterDeckPage() {
  return <SlidesDeck variant="share" />;
}
