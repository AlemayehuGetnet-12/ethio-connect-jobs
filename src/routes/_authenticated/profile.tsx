import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Trash2, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cities } from "@/data/jobs";

type ProfileRow = {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  phone: string;
  city: string;
  skills: string[];
  avatar_path: string | null;
  resume_path: string | null;
  resume_name: string | null;
  resume_size: number | null;
  resume_updated_at: string | null;
};

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile & resume | EthioJobs Connect" },
      {
        name: "description",
        content:
          "Update your professional profile, photo and skills, and upload the resume employers will see on EthioJobs Connect.",
      },
      { property: "og:title", content: "My profile & resume | EthioJobs Connect" },
      {
        property: "og:description",
        content: "Keep your EthioJobs Connect profile and resume up to date.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const resumeInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      if (active) setEmail(user.email ?? "");

      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!data && !error) {
        const inserted = await supabase
          .from("profiles")
          .insert({ id: user.id, full_name: (user.user_metadata?.["full_name"] as string) ?? "" })
          .select("*")
          .single();
        data = inserted.data;
        error = inserted.error;
      }

      if (error) toast.error(error.message);
      if (active) {
        setProfile((data as ProfileRow) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!profile?.avatar_path) {
        setAvatarUrl(null);
        return;
      }
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(profile.avatar_path, 60 * 60);
      if (active) setAvatarUrl(data?.signedUrl ?? null);
    })();
    return () => {
      active = false;
    };
  }, [profile?.avatar_path]);

  function patch(next: Partial<ProfileRow>) {
    setProfile((prev) => (prev ? { ...prev, ...next } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        headline: profile.headline,
        bio: profile.bio,
        phone: profile.phone,
        city: profile.city,
        skills: profile.skills,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }

  async function handleResume(file: File) {
    if (!profile) return;
    if (!RESUME_TYPES.includes(file.type)) {
      toast.error("Resume must be a PDF or Word document");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      toast.error("Resume must be smaller than 5 MB");
      return;
    }
    setUploadingResume(true);
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${profile.id}/resume-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      setUploadingResume(false);
      toast.error(uploadError.message);
      return;
    }
    const previous = profile.resume_path;
    const { error } = await supabase
      .from("profiles")
      .update({
        resume_path: path,
        resume_name: file.name,
        resume_size: file.size,
        resume_updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
    setUploadingResume(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (previous) await supabase.storage.from("resumes").remove([previous]);
    patch({
      resume_path: path,
      resume_name: file.name,
      resume_size: file.size,
      resume_updated_at: new Date().toISOString(),
    });
    toast.success("Resume uploaded");
  }

  async function handleAvatar(file: File) {
    if (!profile) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Photo must be an image");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Photo must be smaller than 2 MB");
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      setUploadingAvatar(false);
      toast.error(uploadError.message);
      return;
    }
    const previous = profile.avatar_path;
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_path: path })
      .eq("id", profile.id);
    setUploadingAvatar(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (previous) await supabase.storage.from("avatars").remove([previous]);
    patch({ avatar_path: path });
    toast.success("Photo updated");
  }

  async function downloadResume() {
    if (!profile?.resume_path) return;
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(profile.resume_path, 60, { download: profile.resume_name ?? true });
    if (error || !data) {
      toast.error(error?.message ?? "Could not open resume");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function removeResume() {
    if (!profile?.resume_path) return;
    const path = profile.resume_path;
    const { error } = await supabase
      .from("profiles")
      .update({ resume_path: null, resume_name: null, resume_size: null, resume_updated_at: null })
      .eq("id", profile.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.storage.from("resumes").remove([path]);
    patch({ resume_path: null, resume_name: null, resume_size: null, resume_updated_at: null });
    toast.success("Resume removed");
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value || !profile) return;
    if (profile.skills.includes(value)) {
      setSkillInput("");
      return;
    }
    patch({ skills: [...profile.skills, value] });
    setSkillInput("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        We couldn't load your profile. Try refreshing the page.
      </div>
    );
  }

  const initials =
    profile.full_name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "EJ";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">My profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Employers see this information when you apply.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">Photo</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={profile.full_name} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleAvatar(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploadingAvatar}
            onClick={() => avatarInput.current?.click()}
          >
            {uploadingAvatar ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Upload className="mr-2 size-4" />
            )}
            Upload photo
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display text-lg">Resume</CardTitle>
          <CardDescription>PDF or Word document, up to 5 MB. Stored privately.</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={resumeInput}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleResume(file);
              e.target.value = "";
            }}
          />
          {profile.resume_path ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/40 p-4">
              <FileText className="size-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{profile.resume_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(profile.resume_size)}
                  {profile.resume_updated_at
                    ? ` · updated ${new Date(profile.resume_updated_at).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={downloadResume}>
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={uploadingResume}
                onClick={() => resumeInput.current?.click()}
              >
                Replace
              </Button>
              <Button variant="ghost" size="sm" onClick={removeResume}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => resumeInput.current?.click()}
              disabled={uploadingResume}
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {uploadingResume ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Upload className="size-5" />
              )}
              Click to upload your resume
            </button>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => patch({ full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  placeholder="+251 ..."
                  onChange={(e) => patch({ phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={profile.headline}
                placeholder="Frontend Developer"
                onChange={(e) => patch({ headline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                value={profile.city}
                onChange={(e) => patch({ city: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a city</option>
                {cities.map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About you</Label>
              <Textarea
                id="bio"
                rows={5}
                value={profile.bio}
                onChange={(e) => patch({ bio: e.target.value })}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="skill">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skill"
                  value={skillInput}
                  placeholder="Add a skill and press Enter"
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  Add
                </Button>
              </div>
              {profile.skills.length ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => patch({ skills: profile.skills.filter((s) => s !== skill) })}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
