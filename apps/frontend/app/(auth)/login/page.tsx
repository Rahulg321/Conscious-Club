import { LoginForm } from "@/components/forms/login-form";
import { TestimonialPanel } from "@/components/testimonial-panel";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Auth panel with soft light gradient */}
      <section className="relative flex items-center justify-center bg-white ">
        <div className="absolute left-4 top-4 md:left-8 md:top-8"></div>

        <div className="w-full max-w-md px-4 py-12 md:px-8">
          <div className="text-center mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to sign in.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>

      <aside className="hidden md:block">
        <TestimonialPanel imageUrl="https://plus.unsplash.com/premium_photo-1756138487610-f76348465c58?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      </aside>
    </main>
  );
}
