import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentProfileData } from "./_data/profile";
import AvatarUpload from "./_components/AvatarUpload";
import ProfileForm from "./_components/ProfileForm";

export default async function StudentPerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const data = await getStudentProfileData(session.user.id);

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>
          Perfil
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--vl-text-3)" }}>
          Seus dados pessoais e foto. O email não pode ser alterado.
        </p>
      </header>

      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--vl-text-3)" }}>
          Foto
        </h2>
        <AvatarUpload initialAvatarUrl={data.avatarUrl} initialName={data.name} />
      </section>

      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--vl-text-3)" }}>
          Dados pessoais
        </h2>
        <ProfileForm
          initial={{
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            state: data.state,
          }}
        />
      </section>
    </div>
  );
}
