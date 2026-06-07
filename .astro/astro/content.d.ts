declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"details/D1-1-1-history-geo.md": {
	id: "details/D1-1-1-history-geo.md";
  slug: "details/d1-1-1-history-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-1-2-geo-definition-framework.md": {
	id: "details/D1-1-2-geo-definition-framework.md";
  slug: "details/d1-1-2-geo-definition-framework";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-1-3-why-geo-matters-2026.md": {
	id: "details/D1-1-3-why-geo-matters-2026.md";
  slug: "details/d1-1-3-why-geo-matters-2026";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-2-1-rankings-vs-citations.md": {
	id: "details/D1-2-1-rankings-vs-citations.md";
  slug: "details/d1-2-1-rankings-vs-citations";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-2-2-keywords-vs-entities.md": {
	id: "details/D1-2-2-keywords-vs-entities.md";
  slug: "details/d1-2-2-keywords-vs-entities";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-2-3-seo-geo-synergy.md": {
	id: "details/D1-2-3-seo-geo-synergy.md";
  slug: "details/d1-2-3-seo-geo-synergy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-3-1-citation-rate.md": {
	id: "details/D1-3-1-citation-rate.md";
  slug: "details/d1-3-1-citation-rate";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-3-2-share-of-model.md": {
	id: "details/D1-3-2-share-of-model.md";
  slug: "details/d1-3-2-share-of-model";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-3-3-ai-referred-traffic.md": {
	id: "details/D1-3-3-ai-referred-traffic.md";
  slug: "details/d1-3-3-ai-referred-traffic";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-4-1-json-ld-implementation.md": {
	id: "details/D1-4-1-json-ld-implementation.md";
  slug: "details/d1-4-1-json-ld-implementation";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-4-2-faq-howto-schema.md": {
	id: "details/D1-4-2-faq-howto-schema.md";
  slug: "details/d1-4-2-faq-howto-schema";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-4-3-organization-person-schema.md": {
	id: "details/D1-4-3-organization-person-schema.md";
  slug: "details/d1-4-3-organization-person-schema";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-5-1-what-are-entities.md": {
	id: "details/D1-5-1-what-are-entities.md";
  slug: "details/d1-5-1-what-are-entities";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-5-2-entity-salience.md": {
	id: "details/D1-5-2-entity-salience.md";
  slug: "details/d1-5-2-entity-salience";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-5-3-entity-knowledge-graph.md": {
	id: "details/D1-5-3-entity-knowledge-graph.md";
  slug: "details/d1-5-3-entity-knowledge-graph";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-6-1-core-web-vitals.md": {
	id: "details/D1-6-1-core-web-vitals.md";
  slug: "details/d1-6-1-core-web-vitals";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-6-2-mobile-first-geo.md": {
	id: "details/D1-6-2-mobile-first-geo.md";
  slug: "details/d1-6-2-mobile-first-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D1-6-3-llms-txt-guide.md": {
	id: "details/D1-6-3-llms-txt-guide.md";
  slug: "details/d1-6-3-llms-txt-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-1-1-baidu-baike-optimization.md": {
	id: "details/D2-1-1-baidu-baike-optimization.md";
  slug: "details/d2-1-1-baidu-baike-optimization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-1-2-baidu-zhidao-strategy.md": {
	id: "details/D2-1-2-baidu-zhidao-strategy.md";
  slug: "details/d2-1-2-baidu-zhidao-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-1-3-baijiahao-content.md": {
	id: "details/D2-1-3-baijiahao-content.md";
  slug: "details/d2-1-3-baijiahao-content";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-2-1-deepseek-reasoning-models.md": {
	id: "details/D2-2-1-deepseek-reasoning-models.md";
  slug: "details/d2-2-1-deepseek-reasoning-models";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-2-2-deepseek-bilingual-content.md": {
	id: "details/D2-2-2-deepseek-bilingual-content.md";
  slug: "details/d2-2-2-deepseek-bilingual-content";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-2-3-deepseek-developer-community.md": {
	id: "details/D2-2-3-deepseek-developer-community.md";
  slug: "details/d2-2-3-deepseek-developer-community";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-3-1-douyin-content-geo.md": {
	id: "details/D2-3-1-douyin-content-geo.md";
  slug: "details/d2-3-1-douyin-content-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-3-2-bytedance-ecosystem.md": {
	id: "details/D2-3-2-bytedance-ecosystem.md";
  slug: "details/d2-3-2-bytedance-ecosystem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-3-3-doubao-multimodal.md": {
	id: "details/D2-3-3-doubao-multimodal.md";
  slug: "details/d2-3-3-doubao-multimodal";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-4-1-qwen-ecommerce.md": {
	id: "details/D2-4-1-qwen-ecommerce.md";
  slug: "details/d2-4-1-qwen-ecommerce";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-4-2-alibaba-cloud-geo.md": {
	id: "details/D2-4-2-alibaba-cloud-geo.md";
  slug: "details/d2-4-2-alibaba-cloud-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-4-3-qwen-technical-content.md": {
	id: "details/D2-4-3-qwen-technical-content.md";
  slug: "details/d2-4-3-qwen-technical-content";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-5-1-kimi-long-context.md": {
	id: "details/D2-5-1-kimi-long-context.md";
  slug: "details/d2-5-1-kimi-long-context";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-5-2-kimi-document-analysis.md": {
	id: "details/D2-5-2-kimi-document-analysis.md";
  slug: "details/d2-5-2-kimi-document-analysis";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-5-3-kimi-research-content.md": {
	id: "details/D2-5-3-kimi-research-content.md";
  slug: "details/d2-5-3-kimi-research-content";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-6-1-pipl-compliance.md": {
	id: "details/D2-6-1-pipl-compliance.md";
  slug: "details/d2-6-1-pipl-compliance";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-6-2-content-censorship-ai.md": {
	id: "details/D2-6-2-content-censorship-ai.md";
  slug: "details/d2-6-2-content-censorship-ai";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D2-6-3-icp-filing-process.md": {
	id: "details/D2-6-3-icp-filing-process.md";
  slug: "details/d2-6-3-icp-filing-process";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-1-1-icp-types.md": {
	id: "details/D3-1-1-icp-types.md";
  slug: "details/d3-1-1-icp-types";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-1-2-icp-application-timeline.md": {
	id: "details/D3-1-2-icp-application-timeline.md";
  slug: "details/d3-1-2-icp-application-timeline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-1-3-hosting-providers-china.md": {
	id: "details/D3-1-3-hosting-providers-china.md";
  slug: "details/d3-1-3-hosting-providers-china";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-2-1-simplified-chinese.md": {
	id: "details/D3-2-1-simplified-chinese.md";
  slug: "details/d3-2-1-simplified-chinese";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-2-2-local-context.md": {
	id: "details/D3-2-2-local-context.md";
  slug: "details/d3-2-2-local-context";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-2-3-visual-localization.md": {
	id: "details/D3-2-3-visual-localization.md";
  slug: "details/d3-2-3-visual-localization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-3-1-baike-creation-guide.md": {
	id: "details/D3-3-1-baike-creation-guide.md";
  slug: "details/d3-3-1-baike-creation-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-3-2-zhihu-authority.md": {
	id: "details/D3-3-2-zhihu-authority.md";
  slug: "details/d3-3-2-zhihu-authority";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-3-3-zhihu-content-formats.md": {
	id: "details/D3-3-3-zhihu-content-formats.md";
  slug: "details/d3-3-3-zhihu-content-formats";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-4-1-wechat-public-accounts.md": {
	id: "details/D3-4-1-wechat-public-accounts.md";
  slug: "details/d3-4-1-wechat-public-accounts";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-4-2-mini-programs-geo.md": {
	id: "details/D3-4-2-mini-programs-geo.md";
  slug: "details/d3-4-2-mini-programs-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-4-3-wechat-video-channels.md": {
	id: "details/D3-4-3-wechat-video-channels.md";
  slug: "details/d3-4-3-wechat-video-channels";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-5-1-baidu-spider-optimization.md": {
	id: "details/D3-5-1-baidu-spider-optimization.md";
  slug: "details/d3-5-1-baidu-spider-optimization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-5-2-baidu-mip-amp.md": {
	id: "details/D3-5-2-baidu-mip-amp.md";
  slug: "details/d3-5-2-baidu-mip-amp";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-5-3-baidu-webmaster-tools.md": {
	id: "details/D3-5-3-baidu-webmaster-tools.md";
  slug: "details/d3-5-3-baidu-webmaster-tools";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-6-1-guanxi-digital.md": {
	id: "details/D3-6-1-guanxi-digital.md";
  slug: "details/d3-6-1-guanxi-digital";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-6-2-festivals-marketing.md": {
	id: "details/D3-6-2-festivals-marketing.md";
  slug: "details/d3-6-2-festivals-marketing";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D3-6-3-kol-koc-strategy.md": {
	id: "details/D3-6-3-kol-koc-strategy.md";
  slug: "details/d3-6-3-kol-koc-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-1-1-transcreation.md": {
	id: "details/D4-1-1-transcreation.md";
  slug: "details/d4-1-1-transcreation";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-1-2-thought-leadership-formats.md": {
	id: "details/D4-1-2-thought-leadership-formats.md";
  slug: "details/d4-1-2-thought-leadership-formats";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-1-3-content-localization-west.md": {
	id: "details/D4-1-3-content-localization-west.md";
  slug: "details/d4-1-3-content-localization-west";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-2-1-linkedin-profile-optimization.md": {
	id: "details/D4-2-1-linkedin-profile-optimization.md";
  slug: "details/d4-2-1-linkedin-profile-optimization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-2-2-linkedin-content-strategy.md": {
	id: "details/D4-2-2-linkedin-content-strategy.md";
  slug: "details/d4-2-2-linkedin-content-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-2-3-linkedin-advertising.md": {
	id: "details/D4-2-3-linkedin-advertising.md";
  slug: "details/d4-2-3-linkedin-advertising";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-3-1-press-release-strategy.md": {
	id: "details/D4-3-1-press-release-strategy.md";
  slug: "details/d4-3-1-press-release-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-3-2-media-relationships.md": {
	id: "details/D4-3-2-media-relationships.md";
  slug: "details/d4-3-2-media-relationships";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-3-3-crisis-communication.md": {
	id: "details/D4-3-3-crisis-communication.md";
  slug: "details/d4-3-3-crisis-communication";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-4-1-google-ai-overviews.md": {
	id: "details/D4-4-1-google-ai-overviews.md";
  slug: "details/d4-4-1-google-ai-overviews";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-4-2-gemini-optimization.md": {
	id: "details/D4-4-2-gemini-optimization.md";
  slug: "details/d4-4-2-gemini-optimization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-4-3-structured-data-google.md": {
	id: "details/D4-4-3-structured-data-google.md";
  slug: "details/d4-4-3-structured-data-google";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-5-1-original-research.md": {
	id: "details/D4-5-1-original-research.md";
  slug: "details/d4-5-1-original-research";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-5-2-data-driven-content.md": {
	id: "details/D4-5-2-data-driven-content.md";
  slug: "details/d4-5-2-data-driven-content";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-5-3-expert-roundups.md": {
	id: "details/D4-5-3-expert-roundups.md";
  slug: "details/d4-5-3-expert-roundups";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-6-1-haier-global.md": {
	id: "details/D4-6-1-haier-global.md";
  slug: "details/d4-6-1-haier-global";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-6-2-byd-electric.md": {
	id: "details/D4-6-2-byd-electric.md";
  slug: "details/d4-6-2-byd-electric";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"details/D4-6-3-tiktok-strategy.md": {
	id: "details/D4-6-3-tiktok-strategy.md";
  slug: "details/d4-6-3-tiktok-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pillars/P1-geo-fundamentals.md": {
	id: "pillars/P1-geo-fundamentals.md";
  slug: "pillars/p1-geo-fundamentals";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pillars/P2-china-ai-ecosystem.md": {
	id: "pillars/P2-china-ai-ecosystem.md";
  slug: "pillars/p2-china-ai-ecosystem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pillars/P3-world-to-china-geo.md": {
	id: "pillars/P3-world-to-china-geo.md";
  slug: "pillars/p3-world-to-china-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pillars/P4-china-to-world-geo.md": {
	id: "pillars/P4-china-to-world-geo.md";
  slug: "pillars/p4-china-to-world-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-1-what-is-geo.md": {
	id: "spokes/S1-1-what-is-geo.md";
  slug: "spokes/s1-1-what-is-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-2-geo-vs-seo.md": {
	id: "spokes/S1-2-geo-vs-seo.md";
  slug: "spokes/s1-2-geo-vs-seo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-3-geo-kpis-metrics.md": {
	id: "spokes/S1-3-geo-kpis-metrics.md";
  slug: "spokes/s1-3-geo-kpis-metrics";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-4-structured-data-geo.md": {
	id: "spokes/S1-4-structured-data-geo.md";
  slug: "spokes/s1-4-structured-data-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-5-entity-authority-geo.md": {
	id: "spokes/S1-5-entity-authority-geo.md";
  slug: "spokes/s1-5-entity-authority-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S1-6-technical-foundations-geo.md": {
	id: "spokes/S1-6-technical-foundations-geo.md";
  slug: "spokes/s1-6-technical-foundations-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-1-baidu-ernie-bot.md": {
	id: "spokes/S2-1-baidu-ernie-bot.md";
  slug: "spokes/s2-1-baidu-ernie-bot";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-2-deepseek-optimization.md": {
	id: "spokes/S2-2-deepseek-optimization.md";
  slug: "spokes/s2-2-deepseek-optimization";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-3-doubao-byteDance.md": {
	id: "spokes/S2-3-doubao-byteDance.md";
  slug: "spokes/s2-3-doubao-bytedance";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-4-qwen-alibaba.md": {
	id: "spokes/S2-4-qwen-alibaba.md";
  slug: "spokes/s2-4-qwen-alibaba";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-5-kimi-moonshot.md": {
	id: "spokes/S2-5-kimi-moonshot.md";
  slug: "spokes/s2-5-kimi-moonshot";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S2-6-ai-regulations-china.md": {
	id: "spokes/S2-6-ai-regulations-china.md";
  slug: "spokes/s2-6-ai-regulations-china";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-1-icp-license-guide.md": {
	id: "spokes/S3-1-icp-license-guide.md";
  slug: "spokes/s3-1-icp-license-guide";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-2-content-localization-china.md": {
	id: "spokes/S3-2-content-localization-china.md";
  slug: "spokes/s3-2-content-localization-china";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-3-baidu-baike-zhihu.md": {
	id: "spokes/S3-3-baidu-baike-zhihu.md";
  slug: "spokes/s3-3-baidu-baike-zhihu";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-4-wechat-b2b-geo.md": {
	id: "spokes/S3-4-wechat-b2b-geo.md";
  slug: "spokes/s3-4-wechat-b2b-geo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-5-technical-seo-baidu.md": {
	id: "spokes/S3-5-technical-seo-baidu.md";
  slug: "spokes/s3-5-technical-seo-baidu";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S3-6-cultural-nuances-marketing.md": {
	id: "spokes/S3-6-cultural-nuances-marketing.md";
  slug: "spokes/s3-6-cultural-nuances-marketing";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-1-english-content-strategy.md": {
	id: "spokes/S4-1-english-content-strategy.md";
  slug: "spokes/s4-1-english-content-strategy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-2-linkedin-global-brand.md": {
	id: "spokes/S4-2-linkedin-global-brand.md";
  slug: "spokes/s4-2-linkedin-global-brand";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-3-international-pr-media.md": {
	id: "spokes/S4-3-international-pr-media.md";
  slug: "spokes/s4-3-international-pr-media";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-4-google-gemini-ai-overviews.md": {
	id: "spokes/S4-4-google-gemini-ai-overviews.md";
  slug: "spokes/s4-4-google-gemini-ai-overviews";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-5-thought-leadership-citations.md": {
	id: "spokes/S4-5-thought-leadership-citations.md";
  slug: "spokes/s4-5-thought-leadership-citations";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"spokes/S4-6-case-studies-global-brands.md": {
	id: "spokes/S4-6-case-studies-global-brands.md";
  slug: "spokes/s4-6-case-studies-global-brands";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
