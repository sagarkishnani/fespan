import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { LinkedInIcon } from "../shared/icons";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

interface Props extends TinaSectionProps {
  group: "board" | "committees";
}

function MemberCard({ member, locale }: { member: any; locale: TinaSectionProps["locale"] }) {
  const role = tField(member, "role", locale);
  return (
    <div className="group relative h-[400px] overflow-hidden rounded-3xl bg-surface-sunken">
      {member.photo && (
        <img src={mediaUrl(member.photo)} alt={member.name || role} loading="lazy" className="block h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-smooth group-hover:scale-105" data-tina-field={tinaField(member, "photo")} />
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn — ${member.name || role}`} className="absolute right-[18px] top-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-content text-white transition-[background-color,transform] duration-300 hover:scale-[1.08] hover:bg-brand-primary">
          <LinkedInIcon />
        </a>
      )}
      <div className="absolute inset-x-3.5 bottom-3.5 rounded-[18px] bg-brand-primary px-5 py-4 text-white">
        <div className="text-[19px] font-medium" data-tina-field={tinaField(member, "role")}>{role}</div>
        <div className="mt-1 text-[14px] uppercase tracking-[0.02em] text-white/90" data-tina-field={tinaField(member, "name")}>{member.name}</div>
      </div>
    </div>
  );
}

export default function AboutTeam({ query, variables, data: initialData, locale, group }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const team = data?.about?.[group];
  if (!team) return <div hidden />;
  const members = (team.members || []).filter(Boolean);
  const isBoard = group === "board";

  return (
    <section className={`container-xl ${isBoard ? "pt-20 lg:pt-[130px]" : "pb-20 pt-20 lg:pb-[130px] lg:pt-[110px]"}`}>
      {isBoard && team.eyebrow && (
        <p data-reveal className="eyebrow" data-tina-field={tinaField(team, "eyebrow")}>{tField(team, "eyebrow", locale)}</p>
      )}
      <h2 data-reveal style={revealDelay(100)} className="mb-12 text-heading-xl" data-tina-field={tinaField(team, "title")}>
        {tField(team, "title", locale)}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: any, i: number) => (
          <div key={i} data-reveal>
            <MemberCard member={member} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  );
}
