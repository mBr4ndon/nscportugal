import { ArticleLayout } from "@/components/ArticleLayout";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal";

export function LegalDocument({ document }: { document: LegalDocumentContent }) {
  return (
    <ArticleLayout
      pretitulo={document.eyebrow}
      titulo={document.title}
      subtitulo={document.subtitle}
    >
      <p className="mb-14 font-display text-[10px] uppercase tracking-[0.24em] text-petrol/50">
        {document.updated}
      </p>

      {document.sections.map((section) => (
        <section key={section.title} className="mb-14 last:mb-0">
          <div className="mb-5 h-px w-10 bg-gold" />
          <h2 className="mb-5 font-display text-2xl font-light leading-tight text-petrol md:text-3xl">
            {section.title}
          </h2>
          {section.paragraphs && (
            <div className="space-y-4 font-serif text-lg leading-relaxed text-petrol/80">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          )}
          {section.items && (
            <ul className="space-y-3 pl-5 font-serif text-lg leading-relaxed text-petrol/80">
              {section.items.map((item) => (
                <li key={item} className="list-disc marker:text-gold">{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </ArticleLayout>
  );
}
