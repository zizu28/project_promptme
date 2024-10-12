import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '928897503126-94mqnknqt20bldbtecvilq2micmt3sum.apps.googleusercontent.com',
            clientSecret: process.env.GOOGLE_CLIENT_SECRETS || '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',
        })
    ],
    callbacks: {
        async session({ session }){
            const sessionUser = await User.findOne({email: session.user.email})
            session.user.id = sessionUser._id
            return session
        },
        async signIn({ profile }){
            await connectToDB();
    
            const userExists = await User.findOne({email: profile.email})
            if(!userExists){
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture
                })
            }
            return true
        }
    }
})

export {handler as GET, handler as POST}