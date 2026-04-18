interface ProjectDetailsProps {
  title: string;
  subtitle: string;
  description: string;
  note?: string;
}

export default function ProjectDetails({ title, subtitle, description, note }: ProjectDetailsProps) {
  const paragraphs = description.split('\n\n').filter(Boolean);

  return (
    <section className="h-screen w-screen shrink-0 flex items-center px-6 md:px-12 lg:px-24 bg-[#F5F2ED]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 w-full max-w-7xl mx-auto">

        <div className="lg:col-span-7">
          <div className="overflow-hidden mb-8">
            <h2 className="reveal-text font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-snug">
              {subtitle}
            </h2>
          </div>
          <div className="prose prose-lg prose-stone font-light text-gray-600">
            {paragraphs.map((para, index) => (
              <div key={index} className="overflow-hidden mb-4">
                <p className="reveal-text m-0">{para}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center">
          <div>
            <div className="overflow-hidden mb-8">
              <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-400">Project</h3>
            </div>
            <ul className="space-y-6">
              <li className="border-b border-gray-200 pb-4 overflow-hidden">
                <span className="reveal-text block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Title</span>
                <span className="reveal-text block text-sm uppercase tracking-wider font-medium">{title}</span>
              </li>
              <li className="border-b border-gray-200 pb-4 overflow-hidden">
                <span className="reveal-text block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Series</span>
                <span className="reveal-text block text-sm uppercase tracking-wider font-medium">{subtitle}</span>
              </li>
              {note && (
                <li className="border-b border-gray-200 pb-4 overflow-hidden">
                  <span className="reveal-text block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Note</span>
                  <span className="reveal-text block text-sm uppercase tracking-wider font-medium">{note}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}