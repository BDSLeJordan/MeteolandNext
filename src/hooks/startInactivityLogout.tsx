
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import { signoutUser } from "@@/utils/api/authApi";

export function useInactivityLogout(delayInMinutes: number) {
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null); 

  const router = useRouter();

  const performLogout = useCallback(async () => {
    console.log("Déconnexion pour inactivité...");

    const result = await signoutUser();

    if (result.success) {
      console.log("✅ Déconnexion API réussie :", result.message);
    } else {
      console.error("❌ Erreur lors de la déconnexion API :", result.error);
    }

    router.push("/timeout");
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }


    if (delayInMinutes > 0) {
      inactivityTimerRef.current = setTimeout(
        performLogout,
        delayInMinutes * 60 * 1000
      );
    }

  }, [delayInMinutes, performLogout]);

  useEffect(() => {

    if (delayInMinutes <= 0) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }

      return;
    }


    resetInactivityTimer();

    const events = [
      "click",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "input",
      "submit",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });


    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };

  }, [resetInactivityTimer, delayInMinutes]);

}
