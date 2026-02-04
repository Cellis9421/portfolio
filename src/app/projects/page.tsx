"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#projects");
  }, [router]);
  return null;
}
