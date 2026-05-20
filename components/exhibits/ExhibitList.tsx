import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { FEATURED_EXHIBITS_QUERY } from "@/lib/sanity/queries/exhibits";
import FlowingMenu from "../ui/interactive/FlowingMenu";

const ExhibitList = async () => {
  const exhibits = await client.fetch(FEATURED_EXHIBITS_QUERY);

  const items = exhibits
    .filter((exhibit) => exhibit.heroImage !== null)
    .map((exhibit) => ({
      link: `/exhibits/${exhibit.slug?.current}`,
      text: exhibit.title ?? '',
      image: urlFor(exhibit.heroImage!).width(800).height(600).url(),
    }));

  return (
    <div>
      <div className="mx-auto bg-[#120F17] py-5 lg:mx-0 justify center items-center w-full text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
          Featured Exhibitions
        </h2>
      </div>

      <div style={{ height: "300px", position: "relative" }}>
        <FlowingMenu
          items={items}
          speed={15}
          textColor="#ffffff"
          bgColor="#120F17"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#120F17"
          borderColor="#ffffff"
        />
      </div>
    </div>
  );
};

export default ExhibitList;