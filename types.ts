
export interface MarketingBrief {
  productName: string;
  category: string;
  description: string;
  targetAudience: string;
  objective: string;
  platforms: string[];
  language: string;
}

export interface Competitor {
  name: string;
  strategy: string;
  spend: string;
}

export interface GoogleAd {
  headline: string;
  headlinePart2?: string;
  description: string;
  keywords: string[];
  competitors?: Competitor[];
  imagePrompt?: string;
  negativePrompt?: string;
}

export interface MetaAd {
  primaryText: string;
  headline: string;
  linkDescription: string;
  imagePrompt: string;
  negativePrompt?: string;
}

export interface LinkedInAd {
  introText: string;
  headline: string;
  ctaLabel: string;
  imagePrompt: string;
  negativePrompt?: string;
}

export interface TwitterAd {
  text: string;
  imagePrompt: string;
  websiteUrl: string;
}

export interface TikTokAd {
  hook: string;
  script: string;
  visualCues: string;
  musicSuggestion: string;
  hashtags: string[];
}

export interface BlogPostIdea {
    title: string;
    outline: string;
    targetKeyword: string;
}

export interface SEOContent {
    metaTitle: string;
    metaDescription: string;
    h1Tag: string;
    organicKeywords: string[];
    blogPostIdeas: BlogPostIdea[];
}

export interface AnalyticsData {
  estimatedMonthlyBudget: string;
  projectedResults: {
    impressions: string;
    clicks: string;
    conversions: string;
    roi: string;
  };
  bestTimeSchedule: {
    platform: string;
    bestDays: string;
    bestTimes: string;
  }[];
}

export interface AudienceAnalysis {
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    incomeLevel: string;
  };
  psychographics: string[];
  painPoints: string[];
  buyingBehavior: {
    spendingHabits: string;
    priceSensitivity: string;
    decisionFactors: string[];
  };
}

export interface LandingPageContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    imagePrompt: string;
  };
  features: {
    title: string;
    description: string;
  }[];
  socialProof: {
    name: string;
    role: string;
    quote: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export interface GeneratedCampaign {
  strategy: string;
  analytics?: AnalyticsData;
  audienceAnalysis?: AudienceAnalysis;
  googleAds?: GoogleAd[];
  metaAds?: MetaAd[];
  linkedinAds?: LinkedInAd[];
  twitterAds?: TwitterAd[];
  tiktokAds?: TikTokAd[];
  seoContent?: SEOContent;
  landingPage?: LandingPageContent;
}

export enum AdPlatform {
  Audience = 'Audience',
  Google = 'Google',
  Meta = 'Meta',
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  TikTok = 'TikTok',
  SEO = 'SEO'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ExpertPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemInstruction: string;
}