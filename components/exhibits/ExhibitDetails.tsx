interface ExhibitDetailsProps {
  title: string;
  subtitle: string;
  exhibitDescription: string;
  artistDescription: string;
}

export default function ExhibitDetails({
  title,
  subtitle,
  exhibitDescription,
  artistDescription,
}: ExhibitDetailsProps) {
  const exhibitParagraphs = exhibitDescription
    .split('\n\n')
    .filter(Boolean);

  const artistParagraphs = artistDescription
    .split('\n\n')
    .filter(Boolean);

  return (
    <section className="min-h-screen md:h-screen w-screen shrink-0 bg-[#F5F2ED] overflow-y-auto">
      <div className="w-full h-full px-5 py-24 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 max-w-7xl mx-auto">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-12 md:space-y-16">

            {/* Exhibit */}
            <div>
              <div className="overflow-hidden mb-2">
                <h3 className="reveal-text text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                  Exhibit
                </h3>
              </div>

              <div className="overflow-hidden mb-5 md:mb-6">
                <h2 className="reveal-text font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
                  {subtitle}
                </h2>
              </div>

              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-stone max-w-none font-light text-gray-600">
                {exhibitParagraphs.map((para, index) => (
                  <div
                    key={index}
                    className="overflow-hidden mb-4 last:mb-0"
                  >
                    <p className="reveal-text m-0 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Artist */}
            <div>
              <div className="overflow-hidden mb-4">
                <h3 className="reveal-text text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                  About the Artist
                </h3>
              </div>

              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-stone max-w-none font-light text-gray-600">
                {artistParagraphs.map((para, index) => (
                  <div
                    key={index}
                    className="overflow-hidden mb-4 last:mb-0"
                  >
                    <p className="reveal-text m-0 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-24">
              <div className="overflow-hidden mb-5 hidden md:block">
                <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-400">
                  Project
                </h3>
              </div>

              <ul className="space-y-4 md:space-y-6">
                <li className="border-b border-gray-200 pb-4 overflow-hidden">
                  <span className="reveal-text block text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Title
                  </span>

                  <span className="reveal-text block text-sm uppercase tracking-wider font-medium">
                    {title}
                  </span>
                </li>

                <li className="border-b border-gray-200 pb-4 overflow-hidden">
                  <span className="reveal-text block text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Series
                  </span>

                  <span className="reveal-text block text-sm uppercase tracking-wider font-medium">
                    {subtitle}
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}