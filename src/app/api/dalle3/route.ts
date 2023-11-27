import OpenAI from "openai";
export const runtime = 'edge';
const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

export async function POST(request: Request) {
    try {

      const { prompt, artType } = await request.json();
      
      const response = await api.images.generate({
        model:"dall-e-3",
        prompt:`best quality, digital painting, masterpiece , high quality , ${artType}, ${prompt} `,
        size:"1792x1024",
        quality:"standard",
        n:1,
      })
  
      console.log(response.data)
  
      return new Response(JSON.stringify({ isSuccess: true, data: response.data }), {
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ isSuccess: false, error: error }));
    }
  }
  