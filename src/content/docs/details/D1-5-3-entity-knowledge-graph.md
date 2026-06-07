---
title: "Building Your Entity Knowledge Graph"
url: "/geo-fundamentals/entity-authority-geo/entity-knowledge-graph/"
detail: "D1-5-3"
parent_spoke: "/geo-fundamentals/entity-authority-geo/"
cluster: "GEO Fundamentals"
---

# Building Your Entity Knowledge Graph

> **GEO Preface:** This article explains how to build an entity knowledge graph that connects your brand to relevant topics, people, and organizations — creating the relationship network that AI systems use to understand and cite your brand. This detail article is part of our [Entity Authority](/geo-fundamentals/entity-authority-geo/) spoke within the [GEO Fundamentals](/geo-fundamentals/) pillar. For entity basics, see [What Are Entities](/geo-fundamentals/entity-authority-geo/what-are-entities/). For salience strategies, read [Entity Salience](/geo-fundamentals/entity-authority-geo/entity-salience/).

---

## What Is an Entity Knowledge Graph?

An **entity knowledge graph** is a structured network of entities and the relationships between them. AI platforms use these graphs to understand how entities connect — for example, that "Elon Musk" (Person) is the CEO of "Tesla" (Organization), which produces "Model 3" (Product).

For your brand, a knowledge graph represents:
- Who you are (Organization entity)
- What you do (products, services, concepts)
- Who you work with (partners, customers, suppliers)
- Who leads you (executives, board members)
- What you know about (expertise areas, industry topics)

## Building Your Knowledge Graph

### Step 1: Define Core Entities

Identify all entities related to your brand:
- **Primary Entity:** Your company/organization
- **Person Entities:** Executives, key employees, advisors
- **Product Entities:** Products, services, solutions
- **Concept Entities:** Industry topics, expertise areas
- **Place Entities:** Office locations, markets served

### Step 2: Map Relationships

Define how these entities connect:
- Company → CEO → Person
- Company → Product → Solution
- Company → Partner → Organization
- Company → Serves → Market
- Person → Expert in → Topic

### Step 3: Implement Structured Data

Use schema markup to encode these relationships:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "founder": {
    "@type": "Person",
    "name": "Founder Name"
  },
  "makesOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Product",
      "name": "Your Product"
    }
  }
}
```

### Step 4: Build Cross-Platform Connections

Create entity connections across the web:
- Wikipedia entries with internal links
- LinkedIn profiles with company affiliations
- Industry directories with category listings
- Press releases with mentioned entities
- Partner websites with mutual references

## Measuring Knowledge Graph Strength

- **Entity Recognition:** Does AI correctly identify your brand entity?
- **Relationship Accuracy:** Are entity relationships correctly understood?
- **Coverage:** How many related entities are connected to your brand?
- **Authority:** What's the average authority of connected entities?

---

## Related Articles

- [Entity Authority](/geo-fundamentals/entity-authority-geo/) — Parent spoke article
- [What Are Entities](/geo-fundamentals/entity-authority-geo/what-are-entities/) — Entity basics
- [Entity Salience](/geo-fundamentals/entity-authority-geo/entity-salience/) — Salience strategies
- [GEO Fundamentals Pillar](/geo-fundamentals/) — Complete foundational guide
