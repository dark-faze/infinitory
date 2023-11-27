import Replicate from "replicate";

export const runtime = 'edge';
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

export async function POST(request: Request) {
  try {
    
    const { prompt, artType } = await request.json();

    let body = {
        prompt: `best quality, digital painting, extremely smooth, fluid, light particles, dreamy, smooth, shimmering, dreamy glow, ${artType}, ${prompt} `,
        negativePrompt: "bad quality, bad anatomy, worst quality, low quality, lowres, extra fingers, blur, blurry, ugly, wrong proportions, watermark, image artifacts",
        width: 1248,
        height:832,
        numberOfImages: 1,
        prompt_strength:0.8,
        num_inference_steps: 4
    }
     
    const output = await replicate.run(
       "lucataco/sdxl-lcm:fbbd475b1084de80c47c35bfe4ae64b964294aa7e237e6537eed938cfd24903d",
        {
          input: body
        }
    );
   
    let data = output

    return new Response(JSON.stringify({ isSuccess: true, data: data }), {
      status: 200,
    });

  } catch (error) {
    // console.log(error);
    return new Response(JSON.stringify({ isSuccess: false, error: error }));
  }
}
