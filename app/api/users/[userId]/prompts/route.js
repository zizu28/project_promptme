import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB()
        const prompts = await Prompt.find({creator: params.userId}).populate('creator')
        return new Response(JSON.stringify(prompts), {status: 200})
    } catch (error) {
        return new Response(`Unable to fetch prompts for user with id: ${params.userId}`, {status: 500})
    }
} 