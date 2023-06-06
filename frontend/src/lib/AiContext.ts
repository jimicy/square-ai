import { Item, MessageDict, PopularItemAnalysis } from "./type";

type GPTMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEFAULT_SYSTEM_PROMPT = `I want you to act as a knowledgeable guide in the realm of Square ecommerce, anticipating my interest in establishing an online store using Square as the platform of choice. Assume that I am an entrepreneur or small business owner seeking to leverage Square's capabilities for selling products or services online. Provide me with a step-by-step walkthrough on how to set up a Square ecommerce store, including the initial account setup, store customization, product listing, and integration of payment gateways. Explain the key features and advantages of using Square for ecommerce, such as its user-friendly interface, secure payment processing, and inventory management tools.
Moreover, I need assistance in generating new product ideas that resonate with my target audience. Offer strategies and techniques for brainstorming, conducting market research, and identifying customer pain points to develop innovative and compelling products or services. Provide guidance on validating product ideas and conducting product testing before officially launching them in the store.
Furthermore, I require help in analyzing trends within my store's orders and understanding customer preferences. Describe methods for extracting meaningful insights from sales data, such as using Square's built-in analytics tools or integrating third-party analytics platforms. Explain how to identify the most popular products by analyzing sales volumes, customer reviews, and website traffic. Offer advice on leveraging customer feedback and reviews to improve existing products or develop new offerings that align with customer demand.
Lastly, discuss strategies for effectively marketing and promoting the Square ecommerce store, including social media marketing, search engine optimization (SEO), and email marketing. Provide tips for driving traffic to the store, increasing conversions, and retaining customers for long-term success.
By addressing these aspects comprehensively, you'll equip me with the knowledge and tools necessary to set up a thriving Square ecommerce store, develop enticing new products, and gain valuable insights from order trends and customer preferences.
`;

const PRODUCT_ANALYSIS_PROMPT = `You are a marketing associate that knows how to do fun, great, concise copywriting and marketing material. Help answer questions and rewrite text given the following context of products.`;
export const GENERATE_NEW_PRODUCT_USER_QUERY = `Come up with only one new product idea for me, based on products you've seen so far. The products should belong in the same category. Print just the new product name followed by a new line and its description. Please generate a completely different product that is novel, interesting and unique.
Lastly, explain why you thought this was a great new product idea without using I. Answer in the following format.
Product Name: <product name>
Description: <product description>
Explaination: <explaination>`;

const CUSTOMER_ANALYSIS_PROMPT = `You are an award winning marketer that's been responsible for many viral campaigns for Nike, Apple, etc. You are well versed in psychographic analysis. You will always provide a psychographic analysis with personality, interest, hobbies, trends, music, food, drinks, TV shows, fashion, sports that those ages groups like also for each category give examples, brands, names, show names, restaurant names, etc.`;
export const CUSTOMER_ANALYSIS_USER_QUERY = `Tell me what age buckets have the most count! And show me a psychographic analysis with personality, interest, hobbies, trends, music, food, drinks, TV shows, fashion, sports that those ages groups like. Also for each category give examples, brands, names, show names, restaurant names, etc.`;

export function generateContextQuery(
  messages: MessageDict[] | undefined,
  query: string
) {
  if (!messages) {
    return query;
  }

  let gptMessages: GPTMessage[] = [];

  let recentSystemMessageIndex = messages.findLastIndex(
    (message: MessageDict) =>
      message.type === "product-catalog" || message.type === "store-customers"
  );

  let recentSystemMessage: MessageDict;
  if (recentSystemMessageIndex === -1) {
    recentSystemMessage = messages[1];
    recentSystemMessageIndex = 1;
  } else {
    recentSystemMessage = messages[recentSystemMessageIndex];
  }

  // Generate the system message
  if (recentSystemMessage && recentSystemMessage.type === "product-catalog") {
    let context = "";
    for (const item of recentSystemMessage.data as Item[]) {
      context +=
        item.item_data?.name + "\n" + item.item_data?.description + "\n";
    }
    gptMessages.push({
      role: "system",
      content: PRODUCT_ANALYSIS_PROMPT + "\n" + context,
    });
  } else if (
    recentSystemMessage &&
    recentSystemMessage.type === "store-customers"
  ) {
    let context =
      "Use the following customer age buckets and their count to answer questions:\n";
    for (const ageBucket of [
      "<18",
      "18-24",
      "25-34",
      "35-44",
      "45-54",
      "55-64",
      "65+",
    ]) {
      const count = recentSystemMessage.data.ageBuckets[ageBucket];
      context += `${ageBucket}: ${count}\n`;
    }

    gptMessages.push({
      role: "system",
      content: CUSTOMER_ANALYSIS_PROMPT + "\n" + context,
    });
  } else if (recentSystemMessage && recentSystemMessage.type === "popular-items-analysis") {
    const data: PopularItemAnalysis = recentSystemMessage.data;

    let context = "Use this store's popular products and target age bucket demographic psychographic analysis to inform coming up with a new product idea. Do not say this back to me.\n";

    context += "Popular Products:\n";
    for (const item of data.top_three_items) {
      context += `${item.name}\n`;
    }

    context += "Target age bucket demographic psychographic analysis:\n";
    context += data.top_three_items_analysis + "\n";

    gptMessages.push({
      role: "user",
      content: context,
    });
  } else {
    gptMessages.push({
      role: "system",
      content: DEFAULT_SYSTEM_PROMPT,
    });
  }

  // Generate the current conversation history
  gptMessages = gptMessages.concat(
    messages
      .slice(recentSystemMessageIndex + 1)
      .filter((msg) => msg.type === "message" || msg.type === "system")
      .map((message: MessageDict) => {
        const chatRole = message.role === "system" ? "assistant" : "user";
        return { role: chatRole, content: message.text };
      })
  );

  // Add the latest user prompt to answer for ChatGPT.
  gptMessages.push({ role: "user", content: query });

  return gptMessages;
}
