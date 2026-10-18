import Image from "next/image";

type UserAvatarProps = {
  name: string;
  subtitle: string;
  imageSrc?: string;
};

// Viser profilbilde eller initialer sammen med brukerens profilinformasjon.
export default function UserAvatar({
  name,
  subtitle,
  imageSrc,
}: UserAvatarProps) {
  // Lager initialer fra brukerens navn når profilbilde ikke er oppgitt.
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <section
      className="flex items-center gap-3 border-t border-slate-200 pt-5"
      aria-label="User profile"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="40px"
            className="rounded-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}

        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
        />
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </section>
  );
}
