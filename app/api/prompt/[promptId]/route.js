import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";

export const GET = async (req, { params }) => {
    try {
        await connectToDB()
        const prompt = await Prompt.findById(params.promptId)
        if(!prompt) return new Response(`No prompt found`, { status: 404 })
        return new Response(JSON.stringify(prompt), { status: 200 })
    } catch (error) {
        console.error('Error fetching prompt:', error)
        return new Response(`Unable to fetch prompt: ${error.message}`, { status: 500 })
    }
}

export const PATCH = async (req, { params }) => {
  try {
    const { prompt, tag } = await req.json()

    await connectToDB()

    const promptToEdit = await Prompt.findByIdAndUpdate(
      params.promptId,
      { prompt, tag },
      { new: true }
    )

    if (!promptToEdit) {
      return new Response(`Prompt with id ${params.promptId} not found`, { status: 404 })
    }

    return new Response(JSON.stringify(promptToEdit), { status: 200 })

  } catch (error) {
    console.error('Error updating prompt:', error)
    return new Response(`Unable to update prompt: ${error.message}`, { status: 500 })
  }
}

export const DELETE = async ({ params }) => {
    try {
        await connectToDB()
        await Prompt.findByIdAndDelete(params.promptId).populate('creator')
        return new Response(`Prompt of Id: ${params.promptId} has been deleted`, { status: 200 })
    } catch (error) {
        console.error('Error deleting prompt:', error)
        return new Response(`Unable to delete prompt: ${error.message}`, { status: 500 })
    }
}