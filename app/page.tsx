/* 
- Copy and paste this code into your Next.js applications's "app/page.tsx" file to get started 
- Make sure to run "npm install usellm" to install the useLLM pacakge
- Replace the `serviceUrl` below with your own service URL for production
*/
"use client";
import useLLM, { OpenAIMessage } from "usellm";
import React, { useState } from "react";

export default function ImageGeneration() {
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role: "assistant",
      content:
        "I'm a chatbot powered by the ChatGPT API and developed using useLLM. Ask me anything!",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  var n = 4;
  var size = "256x256";

  async function handleGenerateClick() {
    setStatus("Generating...");
    setImage("");
    const newHistory = [...history, { role: "user", content: prompt }];
      setHistory(newHistory);
      setPrompt("");
      const { message } = await llm.chat({
        messages: newHistory,
        stream: true,
        onStream: ({ message }) => setHistory([...newHistory, message]),
      });
      setHistory([...newHistory, message]);
      setPrompt(message.content);
      const data = JSON.parse(message.content);
      console.log(data);

    //const { images } = await llm.generateImage({ prompt, n });
    //setImage(images[0]);
    setStatus("");
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">Image Generation</h2>
      <div className="flex my-4">
        <input
          className="p-2 border rounded mr-2 w-full dark:bg-gray-900 dark:text-white"
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2 "
          onClick={handleGenerateClick}
        >
          Generate
        </button>
      </div>

      {status && <div>{status}</div>}
      {
        <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
          {prompt}
        </div>
      }

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4 rounded"
          src={image}
          alt={prompt}
          width={256}
          height={256}
        />
      )}
    </div>
  );
}