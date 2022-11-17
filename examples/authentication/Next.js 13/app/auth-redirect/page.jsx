"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function AuthRedirectView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToken = async () => {
    const access_token = searchParams.get("access_token");
    const response = await fetch("/api/auth/signInWithToken", {
      method: "POST",
      body: JSON.stringify({
        access_token,
      }),
    });

    if (response.ok) router.push("/profile");
    else router.push("/sign-in");
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}

export default AuthRedirectView;
