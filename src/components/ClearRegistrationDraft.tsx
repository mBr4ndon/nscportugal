"use client";

import { useEffect } from "react";

export const REGISTRATION_DRAFT_KEY = "nsc-registration-draft";

export function ClearRegistrationDraft() {
  useEffect(() => {
    sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
  }, []);

  return null;
}
