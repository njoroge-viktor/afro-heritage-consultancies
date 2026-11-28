import { Photo } from "./media";
import { Eyebrow } from "./ui";
import { IMPACT, KEEP_WATERMARK } from "../lib/media";

/** Community outreach: shown on Programs › Community & Adventure. */
export function CommunityOutreach() {
  return (
    <section aria-labelledby="outreach-title" className="tw:mt-16 tw:space-y-14">
      <div className="tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[1.25fr_1fr]">
        <Photo name="community-01-team-walking-village" position={KEEP_WATERMARK.wider} imgClassName="tw:aspect-[16/9] tw:w-full tw:rounded-3xl tw:object-cover" />
        <div data-reveal="right">
          <Eyebrow>Community outreach</Eyebrow>
          <h2 id="outreach-title" className="tw:mt-3 tw:text-3xl tw:font-semibold tw:leading-tight tw:sm:text-4xl">Out in the community</h2>
          <p className="tw:mt-4 tw:leading-relaxed tw:text-ink/75">Beyond our programs at Kony House, our team runs outreach visits and community sessions, from Ngong to Marsabit in northern Kenya.</p>
        </div>
      </div>

      <div className="tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[1fr_1.25fr]">
        <div data-reveal="left" className="tw:order-2 tw:lg:order-1">
          <h3 className="tw:text-2xl tw:font-semibold">Marsabit outreach</h3>
          <p className="tw:mt-3 tw:leading-relaxed tw:text-ink/75">The Director and our team hold community sessions with participants in Marsabit.</p>
        </div>
        <Photo name="director-action-02-community-session-marsabit" className="tw:order-1 tw:lg:order-2" imgClassName="tw:h-auto tw:w-full tw:rounded-3xl" />
      </div>

      {/* Wide section divider (21:9 crop, as specified for this photo). */}
      <Photo name="director-action-04-field-visit-marsabit" position="center 40%" imgClassName="tw:aspect-[21/9] tw:w-full tw:rounded-3xl tw:object-cover" />

      <div className="tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[1.25fr_1fr]">
        <Photo name="director-action-03-handing-out-books" imgClassName="tw:h-auto tw:w-full tw:rounded-3xl" />
        <div data-reveal="right">
          <h3 className="tw:text-2xl tw:font-semibold">Books for young readers</h3>
          <p className="tw:mt-3 tw:leading-relaxed tw:text-ink/75">On community visits, the Director hands out books to pupils.</p>
          {IMPACT.length > 0 && (
            <dl className="tw:mt-6 tw:grid tw:grid-cols-2 tw:gap-4">
              {IMPACT.map(([value, label]) => (
                <div key={label} className="tw:rounded-2xl tw:bg-sage-100 tw:p-5">
                  <dt className="tw:text-sm tw:text-ink/70">{label}</dt>
                  <dd className="tw:font-display tw:text-3xl tw:font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
