"use client";

import { useActionState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/lib/actions/contact";
import { Mail, MapPin, Send } from "lucide-react";

type ContactState = {
  success: boolean;
  demo: boolean;
  error?: Record<string, string[]>;
};

const initialState: ContactState = { success: false, demo: false };

interface ContactPageContentProps {
  email: string;
  location?: string | null;
}

export function ContactPageContent({ email, location }: ContactPageContentProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ContactState, formData: FormData): Promise<ContactState> => {
      const result = await submitContactForm(formData);
      return {
        success: result.success,
        demo: result.demo,
        error: result.error as Record<string, string[]> | undefined,
      };
    },
    initialState
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Have a project in mind or want to connect? I&apos;d love to hear from you.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <Mail className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="mt-3 font-semibold">Email</h2>
              <a
                href={`mailto:${email}`}
                className="mt-1 block text-muted-foreground hover:text-primary"
              >
                {email}
              </a>
            </div>
            <div className="glass rounded-2xl p-6">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="mt-3 font-semibold">Location</h2>
              <p className="mt-1 text-muted-foreground">
                {location ? `${location} — Remote friendly` : "Remote friendly"}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <form action={formAction} className="glass space-y-6 rounded-2xl p-6 sm:p-8" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                aria-describedby={state.error?.name ? "name-error" : undefined}
              />
              {state.error?.name && (
                <p id="name-error" className="text-sm text-destructive" role="alert">
                  {state.error.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-describedby={state.error?.email ? "email-error" : undefined}
              />
              {state.error?.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {state.error.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" autoComplete="off" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                aria-describedby={state.error?.message ? "message-error" : undefined}
              />
              {state.error?.message && (
                <p id="message-error" className="text-sm text-destructive" role="alert">
                  {state.error.message[0]}
                </p>
              )}
            </div>

            {state.success && (
              <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary" role="status">
                {state.demo
                  ? "Message received (demo mode — connect Supabase to persist messages)."
                  : "Thank you! Your message has been sent."}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              <Send className="h-4 w-4" aria-hidden />
              {pending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
