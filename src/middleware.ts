import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./route_util";
import { NextResponse } from "next/server";

const {auth}= NextAuth(authConfig)

export default auth((req)=>{
    const {nextUrl}=req;
    const isLoggedIn=!!req.auth;
    const isApiAuthRoute=nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute=publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute=authRoutes.includes(nextUrl.pathname);

    if(isApiAuthRoute){
        return null;
    }
    if(isAuthRoute){
        if(isLoggedIn){
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if(!isPublicRoute && !isLoggedIn){
        return NextResponse.redirect(new URL("/auth/sign-in", nextUrl));
    }

    return null;
})

export const config={
     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}