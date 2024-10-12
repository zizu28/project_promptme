import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";

export const GET = async (req) => {
    try {
        await connectToDB()
        const prompts = await Prompt.find({}).populate('creator')
        if(!prompts) return new Response(`No prompts found`, { status: 404})
        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response(`Server error: ${error}`, { status: 500 })
    }
}