if (typeof window !== "undefined") {
  // Idea from https://github.com/rafgraph/spa-github-pages
  // See index page
  const baseUrl = "https://lukaw3d.github.io/abi-playground-sapphire/";
  const redirectTo = baseUrl + "?redirect=" + encodeURIComponent(window.location.href.replace(baseUrl, ""));
  window.location.replace(redirectTo);
  // Client-side-only code
}

export default function Custom404() {
  return <></>;
}
