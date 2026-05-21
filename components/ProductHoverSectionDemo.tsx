import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import ProductHoverSection from "./ui/interactive/ProductHoverSection";

const ProductHoverSectionDemo = async () => {
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  if (!featuredProducts || featuredProducts.length === 0) return null;

  const hoverProducts = featuredProducts
    .filter((product) => product.slug && product.images?.[0]?.asset?.url)
    .map((product) => ({
      title: product.name,
      subtitle: `£${product.price?.toFixed(2) ?? "0.00"}`,
      image: product.images![0].asset!.url!,
      alt: product.name,
      slug: product.slug!,
    }));

  return (
    <div
      id="featured"
      className="w-full min-h-[500px] flex items-center justify-center bg-gray-200 rounded-lg py-12"
    >
      <ProductHoverSection products={hoverProducts} />
    </div>
  );
};

export { ProductHoverSectionDemo };