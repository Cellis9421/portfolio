"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContactRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#contact");
  }, [router]);
  return null;
}
