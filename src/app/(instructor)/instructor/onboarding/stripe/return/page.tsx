import { redirect } from "next/navigation";
import { completeStripeOnboarding } from "@/actions/stripe";

export default async function StripeReturnPage() {
  await completeStripeOnboarding();
  redirect("/instructor/onboarding");
}
