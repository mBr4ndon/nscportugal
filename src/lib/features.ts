export function registrationsEnabled(): boolean {
  return process.env.REGISTRATIONS_ENABLED?.trim().toLowerCase() !== "false";
}
