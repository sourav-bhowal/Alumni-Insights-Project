"use client";
import { signUpSchema, SignUpSchemaType } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { signUp } from "./actions";
import { Loader2 } from "lucide-react";

// SIGN UP FORM
export default function SignUpForm() {
  // ERROR STATE
  const [error, setError] = useState<string>();

  // TRANSITION HOOK
  const [isPending, startTransition] = useTransition();

  // FORM
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  // ON FORM SUBMIT
  async function onSubmit(values: SignUpSchemaType) {
    // set error undefined
    setError(undefined);
    // start transition
    startTransition(async () => {
      // send values to server action
      const { error } = await signUp(values);
      // handle error
      if (error) setError(error);
    });
  };

  // RENDER
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </Form>
  );
}
