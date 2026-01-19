import "dotenv/config";
import { McpServer } from "skybridge/server";
import { z } from "zod";

const Answers = [
  "As I see it, yes",
  "Don't count on it",
  "It is certain",
  "It is decidedly so",
  "Most likely",
  "My reply is no",
  "My sources say no",
  "Outlook good",
  "Outlook not so good",
  "Signs point to yes",
  "Very doubtful",
  "Without a doubt",
  "Yes definitely",
  "Yes",
  "You may rely on it",
];

// ChainBridge API Configuration
const CHAINBRIDGE_API_BASE = process.env.CHAINBRIDGE_API_URL || "https://chainbridge.example.com";

const server = new McpServer(
  {
    name: "alpic-openai-app",
    version: "0.0.1",
  },
  { capabilities: {} },
).registerWidget(
  "magic-8-ball",
  {
    description: "Magic 8 Ball",
  },
  {
    description: "For fortune-telling or seeking advice.",
    inputSchema: {
      question: z.string().describe("The user question."),
    },
  },
  async ({ question }) => {
    try {
      // deterministic answer
      const hash = question
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const answer = Answers[hash % Answers.length];
      return {
        structuredContent: { answer },
        content: [],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
).registerWidget(
  "product-groups",
  {
    description: "Product Groups List",
  },
  {
    description: "Get available product categories/groups for retailer search. Use this to discover what product types are available before searching for retailers.",
    inputSchema: {},
  },
  async () => {
    try {
      console.log("[product-groups] CHAINBRIDGE_API_BASE:", CHAINBRIDGE_API_BASE);
      const url = `${CHAINBRIDGE_API_BASE}/api/product-groups`;
      console.log("[product-groups] Fetching from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("[product-groups] Response status:", response.status);
      console.log("[product-groups] Response ok:", response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[product-groups] Error response body:", errorText);
        throw new Error(`Failed to fetch product groups: ${response.status} - ${errorText}`);
      }
      
      const productGroups: string[] = await response.json();
      console.log("[product-groups] Successfully fetched", productGroups.length, "product groups");
      
      return {
        structuredContent: { 
          productGroups,
          count: productGroups.length 
        },
        content: [{ 
          type: "text", 
          text: `Found ${productGroups.length} product groups: ${productGroups.join(", ")}` 
        }],
        isError: false,
      };
    } catch (error) {
      console.error("[product-groups] Error details:", error);
      console.error("[product-groups] Error message:", error instanceof Error ? error.message : String(error));
      console.error("[product-groups] Error stack:", error instanceof Error ? error.stack : "N/A");
      return {
        content: [{ type: "text", text: `Error fetching product groups: ${error}` }],
        isError: true,
      };
    }
  },
).registerWidget(
  "retailer-search",
  {
    description: "Retailer Search Results",
  },
  {
    description: "Search for retailers by product group. Returns retailers that match the specified product category with pagination support.",
    inputSchema: {
      productGroup: z.string().describe("The product category to filter by (e.g., 'Functional', 'Cotton', 'Silk', 'Wool'). Use the product-groups tool first to get available options."),
      page: z.number().int().min(1).default(1).describe("Page number for pagination (default: 1)"),
    },
  },
  async ({ productGroup, page = 1 }) => {
    try {
      const params = new URLSearchParams({
        productGroup,
        page: page.toString(),
      });
      
      const response = await fetch(`${CHAINBRIDGE_API_BASE}/api/retailers/search?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to search retailers: ${response.status}`);
      }
      
      const result = await response.json();
      const retailers: Array<{
        id?: string;
        english_name?: string;
        name: string;
        category: { kind: string; product: string };
        country: string;
        contact: {
          factoryAddress?: string;
          shopAddress?: string;
          wechat?: string;
          website?: string;
          email?: string;
          phone?: string;
        };
        exhibition: Array<{
          name: string;
          address: string;
          boothNumber?: string;
          boothCode?: string;
        }>;
      }> = result.data || [];
      
      return {
        structuredContent: { 
          retailers,
          productGroup,
          page: result.page || page,
          limit: result.limit || 10,
          count: retailers.length,
        },
        content: [{ 
          type: "text", 
          text: `Found ${retailers.length} retailers for "${productGroup}" (Page ${page})` 
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching retailers: ${error}` }],
        isError: true,
      };
    }
  },
);

export default server;
export type AppType = typeof server;
