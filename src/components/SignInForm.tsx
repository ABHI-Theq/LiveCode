"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from "next-auth/react";

const SignInForm = () => {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account with one click
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2 transition-transform hover:scale-[1.02]"
          aria-label="Sign in with Google"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="h-4 w-4" />
          Sign in with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2 transition-transform hover:scale-[1.02]"
          aria-label="Sign in with GitHub"
          onClick={() => signIn("github")}
        >
          <FaGithub className="h-4 w-4" />
          Sign in with GitHub
        </Button>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-center text-muted-foreground w-full">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
        