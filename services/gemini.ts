import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCampaign, MarketingBrief, ExpertPersona, LandingPageContent } from "../types";

// Helper function to create a fresh client instance with the current API key
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Ensure you have selected a key.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// --- Campaign Generation ---

export const generateMarketingCampaign = async (brief: MarketingBrief): Promise<GeneratedCampaign> => {
  const ai = getAiClient();
  const platforms = brief.platforms && brief.platforms.length > 0 ? brief.platforms : ['Google', 'Meta'];
  
  const platformPrompts = [];
  if (platforms.includes('Google')) {
    platformPrompts.push("2 variations of Google Search Ads (Headlines, Descriptions, Keywords). For each ad, also identify 1 major competitor with their likely ad strategy and estimated monthly spend.");
  }
  if (platforms.includes('Meta')) {
    platformPrompts.push("2 variations of Meta (Facebook/Instagram) Ads (Primary Text, Headline, Link Description, and a highly detailed Image Prompt).");
  }
  if (platforms.includes('LinkedIn')) {
    platformPrompts.push("2 variations of LinkedIn Ads (Intro Text, Headline, CTA Label, and Image Prompt). Use professional, corporate tone.");
  }
  if (platforms.includes('Twitter')) {
    platformPrompts.push("2 variations of Twitter/X Ads (Tweet Text, Website URL placeholder, and Image Prompt). Keep text under 280 chars, punchy and engaging.");
  }
  if (platforms.includes('TikTok')) {
    platformPrompts.push("2 variations of TikTok/Reels Video Scripts. Include: A catchy 'Hook' (first 3 seconds), the main 'Script' (spoken words), 'VisualCues' (what happens on screen), a 'MusicSuggestion' (vibe/genre), and 3 viral 'Hashtags'.");
  }

  // Always generate SEO strategy regardless of platform selection, as it's a bonus feature
  const seoPrompt = `
    Also generate an SEO Strategy containing:
    1. A high-CTR Meta Title (under 60 chars).
    2. A compelling Meta Description (under 160 chars).
    3. An engaging H1 Tag for the landing page.
    4. 3 high-value Organic Keywords (different from paid keywords).
    5. 2 Blog Post Ideas (Title, short Outline, Target Keyword) to drive organic traffic.
  `;

  const analyticsPrompt = `
    Also Provide a realistic Financial & Performance Projection based on the ${brief.objective} objective for the ${brief.category} industry:
    1. Estimated Monthly Budget range (e.g. $1000 - $2000).
    2. Projected Impressions, Clicks, and Conversions (Leads/Sales) counts.
    3. Estimated ROI or ROAS.
    4. Best Time to Post schedule for the selected platforms (${platforms.join(', ')}).
  `;

  const audiencePrompt = `
    Analyze the Target Audience in depth:
    1. Demographics (Age range, Gender distribution, Key locations, Income level).
    2. Psychographics (5 Key Interests/Values/Lifestyle choices).
    3. Key Pain Points (3 major problems they face related to this product).
    4. Buying Behavior (Impulse vs Planned, Price sensitivity, and 3 key Decision Factors).
  `;

  const landingPagePrompt = `
    Create a high-converting Landing Page structure:
    1. Hero Section (Headline, Subheadline, CTA Text, Image Prompt).
    2. 3 Key Features (Title, Description).
    3. 2 Social Proof Testimonials (Name, Role, Quote).
    4. 3 Frequently Asked Questions (Question, Answer).
  `;

  const prompt = `
    Act as a world-class digital marketing strategist. 
    Create a comprehensive ad campaign for the following product.
    
    IMPORTANT: Provide all text content in the following language: ${brief.language}.
    
    Product: ${brief.productName}
    Industry Category: ${brief.category}
    Description: ${brief.description}
    Target Audience: ${brief.targetAudience}
    Objective: ${brief.objective}
    Selected Platforms: ${platforms.join(', ')}

    Provide:
    1. A short strategic angle (1-2 sentences) tailored to the ${brief.category} industry.
    2. ${audiencePrompt}
    3. ${platformPrompts.join('\n    ')}
    4. ${seoPrompt}
    5. ${analyticsPrompt}
    6. ${landingPagePrompt}
  `;

  // Using gemini-3-pro-preview for complex text generation tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING },
          audienceAnalysis: {
            type: Type.OBJECT,
            properties: {
              demographics: {
                type: Type.OBJECT,
                properties: {
                  ageRange: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  location: { type: Type.STRING },
                  incomeLevel: { type: Type.STRING }
                }
              },
              psychographics: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              painPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              buyingBehavior: {
                type: Type.OBJECT,
                properties: {
                  spendingHabits: { type: Type.STRING },
                  priceSensitivity: { type: Type.STRING },
                  decisionFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          },
          analytics: {
            type: Type.OBJECT,
            properties: {
              estimatedMonthlyBudget: { type: Type.STRING },
              projectedResults: {
                type: Type.OBJECT,
                properties: {
                  impressions: { type: Type.STRING },
                  clicks: { type: Type.STRING },
                  conversions: { type: Type.STRING },
                  roi: { type: Type.STRING }
                }
              },
              bestTimeSchedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    bestDays: { type: Type.STRING },
                    bestTimes: { type: Type.STRING }
                  }
                }
              }
            }
          },
          googleAds: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                headlinePart2: { type: Type.STRING },
                description: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                competitors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      strategy: { type: Type.STRING },
                      spend: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          },
          metaAds: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                primaryText: { type: Type.STRING },
                headline: { type: Type.STRING },
                linkDescription: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              }
            }
          },
          linkedinAds: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    introText: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    ctaLabel: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                }
            }
          },
          twitterAds: {
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: {
                     text: { type: Type.STRING },
                     imagePrompt: { type: Type.STRING },
                     websiteUrl: { type: Type.STRING }
                 }
             }
          },
          tiktokAds: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                script: { type: Type.STRING },
                visualCues: { type: Type.STRING },
                musicSuggestion: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          seoContent: {
              type: Type.OBJECT,
              properties: {
                  metaTitle: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  h1Tag: { type: Type.STRING },
                  organicKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  blogPostIdeas: {
                      type: Type.ARRAY,
                      items: {
                          type: Type.OBJECT,
                          properties: {
                              title: { type: Type.STRING },
                              outline: { type: Type.STRING },
                              targetKeyword: { type: Type.STRING }
                          }
                      }
                  }
              }
          },
          landingPage: {
            type: Type.OBJECT,
            properties: {
              hero: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  subheadline: { type: Type.STRING },
                  ctaText: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING }
                }
              },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              },
              socialProof: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    quote: { type: Type.STRING }
                  }
                }
              },
              faq: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as GeneratedCampaign;
  }
  throw new Error("Failed to generate campaign data");
};

// --- Image Generation ---

export const generateCreativeImage = async (imagePrompt: string, negativePrompt?: string, aspectRatio: string = "1:1"): Promise<string> => {
  const ai = getAiClient();
  try {
    let prompt = `Generate a professional, high-quality advertising image based on this description: ${imagePrompt}.`;
    
    if (negativePrompt) {
      prompt += ` Exclude the following elements: ${negativePrompt}.`;
    }
    
    prompt += ` Ensure it is suitable for social media marketing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio, // "1:1", "3:4", "4:3", "9:16", "16:9"
        }
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback for visual testing if API fails or quota exceeded
    return `https://picsum.photos/seed/${encodeURIComponent(imagePrompt.slice(0, 10))}/800/800`;
  }
};

// --- Media Analysis ---

export const analyzeUploadedMedia = async (file: File, language: string): Promise<string> => {
    const ai = getAiClient();
    
    // helper to convert to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // remove data:image/jpeg;base64, prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    try {
        const base64Data = await fileToBase64(file);
        
        // Prompt
        const prompt = `Analyze this visual content (image or video frame) for a digital marketing context.
        1. Describe what is visible in detail.
        2. Identify the mood and emotional tone.
        3. Assess the visual quality and aesthetics.
        4. Suggest 3 marketing headlines that would pair well with this visual.
        5. Suggest a target audience that would resonate with this visual.
        
        Provide the response strictly in ${language}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: file.type, data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        return response.text || "Could not analyze media.";
    } catch (error: any) {
        console.error("Media analysis error:", error);
        if (error.message?.includes("413")) {
            throw new Error("File is too large. Please upload a smaller file.");
        }
        throw error;
    }
};

// --- Expert Chat ---

export const createExpertChatSession = (persona: ExpertPersona, brief: MarketingBrief) => {
  const ai = getAiClient();
  const context = `
    Context for this conversation:
    Product: ${brief.productName}
    Industry Category: ${brief.category}
    Description: ${brief.description}
    Target Audience: ${brief.targetAudience}
    Objective: ${brief.objective}
    Platforms: ${brief.platforms?.join(', ') || 'General'}
    Language Preference: ${brief.language}
    
    IMPORTANT: You MUST reply in ${brief.language}.
  `;

  // Upgraded to gemini-3-pro-preview for better conversational reasoning
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `${persona.systemInstruction} \n ${context}`,
    },
  });
};

// --- Landing Page Content ---
export const generateLandingPageContent = async (brief: MarketingBrief): Promise<LandingPageContent> => {
    const ai = getAiClient();
    const prompt = `
    Create a high-converting Landing Page structure for the following product:
    Product: ${brief.productName}
    Description: ${brief.description}
    Language: ${brief.language}

    Include:
    1. Hero Section (Headline, Subheadline, CTA Text, Image Prompt).
    2. 3 Key Features (Title, Description).
    3. 2 Social Proof Testimonials (Name, Role, Quote).
    4. 3 Frequently Asked Questions (Question, Answer).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hero: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            subheadline: { type: Type.STRING },
                            ctaText: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING }
                        }
                    },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    },
                    socialProof: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                role: { type: Type.STRING },
                                quote: { type: Type.STRING }
                            }
                        }
                    },
                    faq: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                answer: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as LandingPageContent;
    }
    throw new Error("Failed to generate landing page content");
};

// --- Report Generation ---

export const generateStrategyReport = async (brief: MarketingBrief): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    Create a professional, detailed Digital Marketing Strategy Report for the following client.
    
    Client Brief:
    Product: ${brief.productName}
    Industry Category: ${brief.category}
    Description: ${brief.description}
    Audience: ${brief.targetAudience}
    Goal: ${brief.objective}
    Platforms: ${brief.platforms?.join(', ') || 'All major platforms'}

    The report must be formatted as valid HTML code (inside a <div>, but do NOT include <html> or <body> tags).
    Use Tailwind CSS classes for styling to make it look like a clean, modern document.
    Generate the content in ${brief.language} language.
    
    Structure:
    1. Executive Summary
    2. Comprehensive Audience Persona Analysis (Demographics, Psychographics, Pain Points)
    3. Recommended Channel Mix (Focus on selected platforms: ${brief.platforms?.join(', ')})
    4. Content Strategy Pillars specific to the ${brief.category} industry.
    5. Key Performance Indicators (KPIs) & Projections (Include budget, leads, sales estimates)
    6. Best Posting Schedule Overview
    7. Next Steps
    
    Make it look professional with headings (text-2xl, text-xl), standard paragraph text, lists, and maybe a simple HTML table for the KPI section.
  `;

  // Upgraded to gemini-3-pro-preview for better long-form content generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  // Cleanup to ensure we just get the HTML part if the model adds markdown ticks
  let html = response.text || "<p>Failed to generate report.</p>";
  html = html.replace(/```html/g, '').replace(/```/g, '');
  return html;
};
