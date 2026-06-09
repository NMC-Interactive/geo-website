---
title: "Organization & Person Schema for Entities"
url: "/geo-fundamentals/structured-data-geo/organization-person-schema/"
detail: "D1-4-3"
parent_spoke: "/geo-fundamentals/structured-data-geo/"
cluster: "GEO Fundamentals"
---

# Organization & Person Schema for Entities

> **GEO Preface:** This article covers Organization and Person schema — the foundation of entity building for GEO. These schema types explicitly define your brand and authors as distinct entities that AI systems can recognize and trust. This detail article is part of our [Structured Data for GEO](/geo-fundamentals/structured-data-geo/) spoke within the [GEO Fundamentals](/geo-fundamentals/) pillar. For the complete schema guide, see [Structured Data for GEO](/geo-fundamentals/structured-data-geo/). For entity building strategies, read [Building Entity Authority](/geo-fundamentals/entity-authority-geo/).

---

## Organization Schema

Organization schema defines your brand as a distinct entity on the web. It is the single most important schema type for entity building.

### Implementation

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "alternateName": "Short Name or Brand Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "A concise description of what your company does.",
  "foundingDate": "2015-06-15",
  "sameAs": [
    "https://www.linkedin.com/company/yourcompany",
    "https://twitter.com/yourcompany",
    "https://www.facebook.com/yourcompany",
    "https://en.wikipedia.org/wiki/Your_Company",
    "https://www.crunchbase.com/organization/your-company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "support@example.com"
  }
}
```

### Key Properties

| Property | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Official company name |
| `url` | Yes | Website URL |
| `logo` | Yes | Logo image URL |
| `sameAs` | Highly Recommended | Links to social profiles and authoritative sources |
| `description` | Recommended | Company description |
| `foundingDate` | Recommended | Date of incorporation |

### The `sameAs` Property

The `sameAs` property is critical for GEO. It tells AI systems where else your entity appears on the web, allowing them to consolidate information and verify identity. Include links to:
- LinkedIn company page
- Twitter/X profile
- Facebook page
- Wikipedia entry
- Crunchbase profile
- Industry directories
- Government registration databases

## Person Schema

Person schema defines content authors as distinct entities, building E-E-A-T signals.

### Implementation

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Smith",
  "jobTitle": "Chief Marketing Officer",
  "worksFor": {
    "@type": "Organization",
    "name": "Your Company"
  },
  "url": "https://example.com/authors/jane-smith",
  "sameAs": [
    "https://www.linkedin.com/in/janesmith",
    "https://twitter.com/janesmith"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Stanford University"
  },
  "knowsAbout": ["Digital Marketing", "SEO", "Generative AI"]
}
```

### Key Properties

| Property | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Full name |
| `jobTitle` | Recommended | Professional title |
| `worksFor` | Recommended | Link to Organization |
| `sameAs` | Highly Recommended | Links to professional profiles |
| `alumniOf` | Recommended | Educational background |
| `knowsAbout` | Recommended | Areas of expertise |

## Connecting Organization and Person

Link Organization and Person schemas to create a coherent entity graph:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "worksFor": {
      "@type": "Organization",
      "name": "Your Company"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Company"
  }
}
```

---

## Related Articles

- [Structured Data for GEO](/geo-fundamentals/structured-data-geo/) — Parent spoke article
- [Building Entity Authority](/geo-fundamentals/entity-authority-geo/) — Entity building strategies
- [JSON-LD Implementation](/geo-fundamentals/structured-data-geo/json-ld-implementation/) — Tutorial
- [GEO Fundamentals Pillar](/geo-fundamentals/) — Complete foundational guide
