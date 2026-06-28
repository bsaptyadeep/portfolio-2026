"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, ImagePlus, Loader2 } from "lucide-react";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileAvatar } from "@/components/sections/home/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  updateProfile,
  uploadProfileAvatar,
  uploadProfileResume,
} from "@/lib/actions/admin/profile";
import { getDisplayName } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const avatarRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile.resume_url ?? "");
  const [resumeName, setResumeName] = useState(
    profile.resume_url ? "Uploaded resume.pdf" : ""
  );
  const [openToWork, setOpenToWork] = useState(profile.open_to_work ?? true);

  const displayName = getDisplayName(profile.full_name);

  async function handleAvatarUpload(file: File) {
    setIsUploadingAvatar(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProfileAvatar(formData);
    setIsUploadingAvatar(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setAvatarUrl(result.data.url);
  }

  async function handleResumeUpload(file: File) {
    setIsUploadingResume(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProfileResume(formData);
    setIsUploadingResume(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setResumeUrl(result.data.url);
    setResumeName(file.name);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    formData.set("avatar_url", avatarUrl);
    formData.set("resume_url", resumeUrl);
    formData.set("open_to_work", String(openToWork));

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your public profile information."
      />

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}
      {success && (
        <AlertBanner
          message="Profile updated successfully."
          variant="success"
          onDismiss={() => setSuccess(false)}
        />
      )}

      <form action={handleSubmit} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Photo & Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ProfileAvatar name={displayName} src={avatarUrl || null} size="lg" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Profile photo</p>
                  <p className="text-sm text-muted-foreground">
                    Shown on your homepage hero section. JPG, PNG, or WebP up to 5MB.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingAvatar || isPending}
                    onClick={() => avatarRef.current?.click()}
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <ImagePlus className="h-4 w-4" aria-hidden />
                    )}
                    {isUploadingAvatar ? "Uploading..." : "Upload photo"}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => setAvatarUrl("")}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-border/50 pt-6">
              <div>
                <p className="text-sm font-medium">Resume</p>
                <p className="text-sm text-muted-foreground">
                  PDF only, up to 10MB. Adds a download button on your homepage.
                </p>
              </div>
              {resumeUrl && (
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{resumeName}</p>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Preview current resume
                    </a>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploadingResume || isPending}
                  onClick={() => resumeRef.current?.click()}
                >
                  {isUploadingResume ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <FileText className="h-4 w-4" aria-hidden />
                  )}
                  {isUploadingResume ? "Uploading..." : resumeUrl ? "Replace resume" : "Upload resume"}
                </Button>
                {resumeUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => {
                      setResumeUrl("");
                      setResumeName("");
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={resumeRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleResumeUpload(file);
                  e.target.value = "";
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  defaultValue={profile.headline ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile.location ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={profile.website ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" name="github" defaultValue={profile.github ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  defaultValue={profile.linkedin ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ""} />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
              <Switch
                id="open_to_work"
                checked={openToWork}
                label="Open to opportunities"
                onCheckedChange={setOpenToWork}
              />
              <div>
                <Label htmlFor="open_to_work" className="cursor-pointer">
                  Open to opportunities
                </Label>
                <p className="text-xs text-muted-foreground">
                  Shows the availability badge on your homepage hero
                </p>
              </div>
            </div>
            <Button type="submit" disabled={isPending || isUploadingAvatar || isUploadingResume}>
              {isPending ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
