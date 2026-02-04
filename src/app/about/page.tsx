"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AboutRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#about");
  }, [router]);
  return null;
}
