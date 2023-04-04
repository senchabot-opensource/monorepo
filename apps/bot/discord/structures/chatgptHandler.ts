import https from "https";
import { env } from "../utils/env";

class ChatGPTHandler {
  private messageContent: string;
  private responseMessage: string;
  private reqOptions;

  constructor() {
    this.reqOptions = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${env.CHATGPT_API_KEY}`,
      },
    };
    this.messageContent = "";
    this.responseMessage = "";
  }

  setMessage(message: string) {
    this.messageContent = message;
  }

  async handleRequest() {
    const request = https.request(this.reqOptions, (req) => {
      let data = "";

      req.on("connect", (connection) => {
        console.log("OPENAI CONNECTION: ", connection);
      });

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", async () => {
        const response = JSON.parse(data);
        console.log(response.choices[0].message.content);
        this.responseMessage = await response.choices[0].message.content;
      });

      req.on("error", (error) => {
        console.log("error", error);
      });
    });

    const postData = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: this.messageContent }],
      temperature: 0.7,
    });

    request.write(postData);

    request.end();
  }

  handleResponse(): string {
    return this.responseMessage;
  }
}

const chatgptHandler = new ChatGPTHandler();
