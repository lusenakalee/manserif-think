interface ExhibitDetailsProps {
  title: string;
  subtitle: string;
  exhibitDescription: string;
  artistDescription: string;
}

export default function ExhibitDetails({ title, subtitle, exhibitDescription, artistDescription }: ExhibitDetailsProps) {
  const exhibitParagraphs = exhibitDescription.split('\n\n').filter(Boolean);
  const artistParagraphs = artistDescription.split('\n\n').filter(Boolean);

  return (
    <section className="h-screen w-full md:w-screen shrink-0 pt-24 flex items-center px-6 md:px-12 lg:px-24 bg-[#F5F2ED]">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 w-full max-w-7xl mx-auto">

        <div className="lg:col-span-7 space-y-10">
          <div>
            <div className="overflow-hidden mb-2">
              <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-400">Exhibit</h3>
            </div>
            <div className="overflow-hidden mb-6">
              <h2 className="reveal-text font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-snug">
                {subtitle}
              </h2>
            </div>
            <div className="prose prose-lg prose-stone w-screen md:w-auto font-light text-gray-600">
              {exhibitParagraphs.map((para, index) => (
                <div key={index} className="overflow-hidden">
                  <p className="reveal-text m-0">{para}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="overflow-hidden mb-4">
              <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-400">About the Artist</h3>
            </div>
            <div className="prose prose-lg prose-stone w-screen md:w-auto font-light text-gray-600">
              {artistParagraphs.map((para, index) => (
                <div key={index} className="overflow-hidden">
                  <p className="reveal-text m-0">{para}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex -pt-24 justify-center">
          <div>
            <div className="overflow-hidden">
              <h3 className="reveal-text text-xs uppercase hidden md:flex tracking-[0.2em] text-gray-400">Project</h3>
            </div>
            <ul className="space-y-2 md:space-y-6">
              <li className="border-b border-gray-200 pb-4 overflow-hidden">
                <span className="reveal-text block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Title</span>
                <span className="reveal-text block text-sm uppercase tracking-wider font-medium">{title}</span>
              </li>
              <li className="border-b border-gray-200 pb-4 overflow-hidden">
                <span className="reveal-text block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Series</span>
                <span className="reveal-text block text-sm uppercase tracking-wider font-medium">{subtitle}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}