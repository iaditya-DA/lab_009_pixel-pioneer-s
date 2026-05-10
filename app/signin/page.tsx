"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

export default function SignInPage() {
  const router = useRouter();
  return (
    <AuthModal
      isOpen={true}
      onClose={() => router.push('/')}
    />
  );
}