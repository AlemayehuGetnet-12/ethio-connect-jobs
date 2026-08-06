import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EthioJobs Connect | Support & Employers" },
      {
        name: "description",
        content:
          "Get in touch with the EthioJobs Connect team in Addis Ababa about hiring, job posts or support.",
      },
      { property: "og:title", content: "Contact EthioJobs Connect | Support & Employers" },
      {
        property: "og:description",
        content: "Reach the EthioJobs Connect team about hiring, job posts or support.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-3xl font-semibold">Contact us</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Questions about posting a job or your application? Our team in Addis Ababa replies within
          one working day.
        </p>
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-accent" /> hello@ethiojobsconnect.et
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-accent" /> +251 11 555 0142
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-accent" /> Bole Road, Addis Ababa
          </p>
        </div>
      </div>

      <form
        className="rounded-xl border border-border bg-card p-6 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const parsed = contactSchema.safeParse({
            name: form.get("name"),
            email: form.get("email"),
            message: form.get("message"),
          });
          if (!parsed.success) {
            const next: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
              next[String(issue.path[0])] = issue.message;
            }
            setErrors(next);
            return;
          }
          setErrors({});
          e.currentTarget.reset();
          toast.success("Message sent", {
            description: "We'll get back to you within one working day.",
          });
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" className="mt-1.5" maxLength={100} />
            {errors['name'] ? <p className="mt-1 text-xs text-destructive">{errors['name']}</p> : null}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" className="mt-1.5" maxLength={255} />
            {errors['email'] ? <p className="mt-1 text-xs text-destructive">{errors['email']}</p> : null}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} className="mt-1.5" maxLength={1000} />
            {errors['message'] ? (
              <p className="mt-1 text-xs text-destructive">{errors['message']}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </div>
      </form>
    </div>
  );
}
