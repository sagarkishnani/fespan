import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { LinkedInIcon } from "../shared/icons";
import Carousel from "../shared/Carousel";
import { t } from "../../i18n/ui";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

interface Props extends TinaSectionProps {
  group: "board" | "committees";
}

function MemberCard({ member, locale }: { member: any; locale: TinaSectionProps["locale"] }) {
  const role = tField(member, "role", locale);
  return (
    <div className="group relative h-[340px] overflow-hidden rounded-3xl bg-surface-sunken lg:h-[400px]">
      {member.photo && (
        <img src={mediaUrl(member.photo)} alt={member.name || role} loading="lazy" className="block h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-smooth group-hover:scale-105" data-tina-field={tinaField(member, "photo")} />
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn — ${member.name || role}`} className="absolute right-[18px] top-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-content text-white transition-[background-color,transform] duration-300 hover:scale-[1.08] hover:bg-brand-primary">
          <LinkedInIcon />
        </a>
      )}
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-brand-primary px-4 py-3.5 text-white lg:inset-x-3.5 lg:bottom-3.5 lg:rounded-[18px] lg:px-5 lg:py-4">
        <div className="text-subtitle-xs font-medium" data-tina-field={tinaField(member, "role")}>{role}</div>
        <div className="mt-1 text-caption-md uppercase tracking-[0.02em] text-white/90" data-tina-field={tinaField(member, "name")}>{member.name}</div>
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
    <section className={`container-xl ${isBoard ? "pt-16 md:pt-20 lg:pt-[130px]" : "pb-16 pt-14 md:pb-20 md:pt-20 lg:pb-[130px] lg:pt-[110px]"}`}>
      {isBoard && team.eyebrow && (
        <p data-reveal className="eyebrow" data-tina-field={tinaField(team, "eyebrow")}>{tField(team, "eyebrow", locale)}</p>
      )}
      <h2 data-reveal style={revealDelay(100)} className="mb-12 text-heading-xl" data-tina-field={tinaField(team, "title")}>
        {tField(team, "title", locale)}
      </h2>
      <div data-reveal>
        <Carousel label={t(isBoard ? "about.board.carousel" : "about.committees.carousel", locale)} slideClassName="w-[260px]" gridClassName="lg:grid-cols-4 lg:gap-5">
          {members.map((member: any, i: number) => (
            <MemberCard key={i} member={member} locale={locale} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
