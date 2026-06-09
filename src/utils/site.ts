import bioData from '../data/bio.json';

export const SITE_NAME = 'GEO Visibility Guide';
export const SITE_TITLE_SUFFIX = 'GEO Visibility Guide';
export const SITE_DESCRIPTION =
  'Tutorial-first guidance for Generative Engine Optimization, AI visibility, and China-market GEO strategy.';
export const ORGANIZATION_NAME = 'NMC Interactive';
export const CONTACT_EMAIL = 'contact@nmc-interactive.com';
export const DEFAULT_OG_IMAGE = '/images/article-1.jpg';

export const AUTHORS = bioData.authors;

export function getAuthorById(authorId = 'river-ho') {
  return AUTHORS.find((author) => author.id === authorId) ?? AUTHORS[0];
}

export function buildOrganizationJsonLd(origin: URL | undefined) {
  const author = getAuthorById();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: origin ? new URL('/', origin).href : undefined,
    email: CONTACT_EMAIL,
    sameAs: Object.values(author.profiles).map((profile) => profile.url),
  };
}
