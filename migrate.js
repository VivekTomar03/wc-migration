const axios = require("axios");
require("dotenv").config();

async function migrateAllProducts() {
  console.log("🚀 Starting full migration...");

  // Source API
  const sourceAPI = axios.create({
    baseURL: process.env.SOURCE_URL,
    auth: {
      username: process.env.SOURCE_CONSUMER_KEY,
      password: process.env.SOURCE_CONSUMER_SECRET,
    },
    timeout: 60000,
  });

  // Target API
  const targetAPI = axios.create({
    baseURL: process.env.TARGET_URL,
    auth: {
      username: process.env.TARGET_CONSUMER_KEY,
      password: process.env.TARGET_CONSUMER_SECRET,
    },
    timeout: 60000,
  });

  let page = 1;
  let totalMigrated = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`📥 Fetching page ${page}...`);

    try {
      const response = await sourceAPI.get(`/wp-json/wc/v3/products`, {
        params: { per_page: 100, page },
      });

      const products = response.data;
      if (!products.length) {
        hasMore = false;
        break;
      }

      for (let product of products) {
        console.log(`\n🔄 Processing: ${product.name}`);

        // Filter fields WooCommerce allows
        function buildProductForTarget(p) {
          return {
            name: p.name,
            slug: p.slug,
            type: p.type,
            status: p.status,
            featured: p.featured,
            catalog_visibility: p.catalog_visibility,
            description: p.description,
            short_description: p.short_description,
            sku: p.sku,
            regular_price: p.regular_price,
            sale_price: p.sale_price || "",
            manage_stock: p.manage_stock,
            stock_quantity: p.stock_quantity,
            stock_status: p.stock_status,
            weight: p.weight,
            dimensions: p.dimensions,
            categories:
              p.categories?.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
              })) || [],
            tags:
              p.tags?.map((tag) => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
              })) || [],
            images:
              p.images?.map((img) => ({
                src: img.src,
                name: img.name || "",
                alt: img.alt || p.name,
              })) || [],
            attributes: p.attributes || [],
            default_attributes: p.default_attributes || [],
            variations: p.variations || [],
            grouped_products: p.grouped_products || [],
            meta_data: p.meta_data || [],
          };
        }

        const cleanProduct = buildProductForTarget(product);

        let retries = 3;
        while (retries > 0) {
          try {
            const result = await targetAPI.post(
              "/wp-json/wc/v3/products",
              cleanProduct
            );
            totalMigrated++;
            console.log(
              `✅ Migrated: ${result.data.name} (New ID: ${result.data.id}) | Total so far: ${totalMigrated}`
            );
            break; // success → exit retry loop
          } catch (err) {
            retries--;
            console.log(
              `❌ Failed: ${err.response?.data?.message || err.message} | Retries left: ${retries}`
            );
            if (retries === 0) {
              console.log(`⚠️ Skipping product: ${product.name}`);
            } else {
              await new Promise((r) => setTimeout(r, 5000)); // wait 5s before retry
            }
          }
        }

        // avoid rate-limit
        await new Promise((r) => setTimeout(r, 1000));
      }

      page++;
    } catch (err) {
      console.error("❌ Page fetch failed:", err.message);
      break;
    }
  }

  console.log(`\n🎉 Migration finished! Total migrated: ${totalMigrated}`);
}

migrateAllProducts();
