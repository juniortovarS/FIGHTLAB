import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getClassesTool, bookClassTool } from "@/lib/ai/tools";
import { saveUserHistory } from "@/lib/memory/store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ?? "anonymous_user";

    const { messages } = await req.json();

    const result = streamText({
      model: google("models/gemini-1.5-flash"),

      messages,

      system: `
Eres el AI Coach oficial de FightLab 🥋🥊
Eres motivador, directo y experto en artes marciales.
Responde corto, claro y listo para voz.
`,

      tools: {
        getClasses: getClassesTool,
        bookClass: bookClassTool,
      },

      onFinish: async ({ text = "" }) => {
        const updatedHistory = [
          ...messages,
          { role: "assistant", content: text },
        ];

        await saveUserHistory(userId, updatedHistory as any);
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Route Error:", error);

    return Response.json(
      { error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}