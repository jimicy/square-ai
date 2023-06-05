import { MessageDict } from "../App";
import { Item } from "./type";

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

const PRODUCT_ANALYSIS_PROMPT = `You are a marketing associate that knows how to do fun, great, concise copywriting and marketing material. Help answer questions and rewrite text given the following context of products.
`;

export function generateContextQuery(
  messages: MessageDict[] | undefined,
  query: string
) {
  if (!messages) {
    return query;
  }

  let gptMessages: GPTMessage[] = [];

  let recentSystemMessageIndex = messages.findLastIndex(
    (message: MessageDict) => message.role === "product-catalog"
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
