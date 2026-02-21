"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../data/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function PhotoboothLayout({ children }) {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/user");
      }
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, [router]);

  if (user === undefined || user === null) {
    return null;
  }

  return <div>{children}</div>;
}
