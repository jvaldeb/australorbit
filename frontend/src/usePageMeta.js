import { useEffect } from "react";

/**
 * usePageMeta — modifica el <head> del documento para SEO.
 * No requiere librerías externas. Compatible con el router manual de main.jsx.
 *
 * Uso:
 *   usePageMeta({ title, description, url, image })
 *
 * Cada página llama a este hook con sus propios valores.
 * Al desmontar el componente, restaura los valores por defecto.
 */

const SITE_NAME  = "Austral Orbit";
const SITE_URL   = "https://australorbit.com";
const SITE_IMAGE = "https://australorbit.com/earth-bg.png";
const SITE_DESC  = "Rastreo de satélites en tiempo real desde el hemisferio sur. Sigue la ISS, satélites chilenos y eventos espaciales desde Chile y Latinoamérica.";

const DEFAULT = {
  title:       `${SITE_NAME} — Rastreo de satélites en tiempo real`,
  description: SITE_DESC,
  url:         SITE_URL,
  image:       SITE_IMAGE,
};

function setMeta(name, content) {
  // Busca por name= o property= (Open Graph usa property)
  let el = document.querySelector(`meta[name="${name}"]`)
        || document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    // Open Graph usa "property", el resto usa "name"
    el.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function usePageMeta({ title, description, url, image } = {}) {
  const resolvedTitle = title
    ? `${title} — ${SITE_NAME}`
    : DEFAULT.title;
  const resolvedDesc  = description || DEFAULT.description;
  const resolvedUrl   = url         || DEFAULT.url;
  const resolvedImage = image       || DEFAULT.image;

  useEffect(() => {
    // Título de la pestaña del browser
    document.title = resolvedTitle;

    // Meta tags básicos (Google)
    setMeta("description",        resolvedDesc);

    // Open Graph (Facebook, LinkedIn, WhatsApp)
    setMeta("og:title",           resolvedTitle);
    setMeta("og:description",     resolvedDesc);
    setMeta("og:url",             resolvedUrl);
    setMeta("og:image",           resolvedImage);
    setMeta("og:type",            "website");
    setMeta("og:site_name",       SITE_NAME);
    setMeta("og:locale",          "es_CL");

    // Twitter Card (también se usa en X)
    setMeta("twitter:card",       "summary_large_image");
    setMeta("twitter:title",      resolvedTitle);
    setMeta("twitter:description", resolvedDesc);
    setMeta("twitter:image",      resolvedImage);

    // URL canónica (evita contenido duplicado en Google)
    setCanonical(resolvedUrl);

    // Al desmontar el componente, restaurar defaults
    return () => {
      document.title = DEFAULT.title;
      setMeta("description",        DEFAULT.description);
      setMeta("og:title",           DEFAULT.title);
      setMeta("og:description",     DEFAULT.description);
      setMeta("og:url",             DEFAULT.url);
      setMeta("og:image",           DEFAULT.image);
      setMeta("twitter:title",      DEFAULT.title);
      setMeta("twitter:description", DEFAULT.description);
      setMeta("twitter:image",      DEFAULT.image);
      setCanonical(DEFAULT.url);
    };
  }, [resolvedTitle, resolvedDesc, resolvedUrl, resolvedImage]);
}
