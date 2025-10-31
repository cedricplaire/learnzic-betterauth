import ReturnButton from "@/components/return-button";

export default async function Page() {

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Success</h1>
      </div>
      <p className="text-destructive">
        You have re-sent a verification link to your EMail
      </p>
    </div>
  );
}
