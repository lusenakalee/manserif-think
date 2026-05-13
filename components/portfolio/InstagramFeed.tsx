"use client";

import { InstagramEmbed } from "react-social-media-embed";

type InstagramFeedProps = {
  postUrls: string[];
};

export default function InstagramFeed({
  postUrls,
}: InstagramFeedProps) {
  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">
          Latest Instagram Posts
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postUrls.map((url, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-white p-3 shadow-sm"
            >
              <div className="flex justify-center">
                <InstagramEmbed
                  url={url}
                  width="100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}