
import OpenAI from "openai";
export const runtime = 'edge';
const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
// model: "gpt-4-vision-preview",

let getStartPrompt = (theme: string) => { 
  return `You are the AI of a game app that is used to write the game's story, the game's theme is ${theme}

    The probability of the actions available for the user to perform is based on the story context, keep options array empty if there are no options

    Write the starting of the story only in this JSON format and nothing else:
    {
        storyText: "Text of the continuation of the story under 50 words"
        options: ["action1" , "action2" , "action3" ]
        imagePrompt: "Prompt"
    }

    where storyText is the text of the continuation of the story
    options are the options that the user can choose from
    imagePrompt is the prompt that will be used to generate the image based on the current storyText`
}

let getContinuationPrompt = (theme: string, lastContext: any) => {

    const storyString = lastContext.map((item:any) => item.selectedOption || item.storyText).join(", ")
    console.log("THis is story string", storyString)

    return `You are the AI of a game app that is used to write the game's story, the game's theme is ${theme}
        The following is the story so far:

        "${storyString}"

        The probability of the actions available for the user to perform is based on the story context, keep options array empty if there are no options
        There's a 50% chance that there will be no options for the user to choose from
        There is also a 10% chance that the story will end here, add a new key called "end" with value true to the JSON object to end the story

        Write the continuation of the story only in this JSON format and nothing else:
        {
            storyText: "Text of the continuation of the story"
            options: ["action1" , "action2" , "action3" ]
            imagePrompt: "Prompt"
        }
    
        where storyText is the text of the continuation of the story under 50 words
        options are the options that the user can choose from
        imagePrompt is the prompt that will be used to generate the image based on the current storyText`
    }


export async function POST(request: Request) {
  try {

    const { prompt, lastContext , isStart, theme } = await request.json();
    let inputContent = isStart ? getStartPrompt(theme) : getContinuationPrompt(theme, lastContext)
    
    const response = await api.chat.completions.create({
       model : 'gpt-4-1106-preview',
       messages: [
        {
            role: "system",
            content: `You are a helpful AI embedded in a game app that is used to write the game's story
                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
          },
          {
            role: "user",
            content: inputContent
          }
       ]
    }) 

    // console.log(response)

    return new Response(JSON.stringify({ isSuccess: true, data: response.choices[0].message.content }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ isSuccess: false, error: error }));
  }
}
