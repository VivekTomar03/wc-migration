const axios = require('axios');
require('dotenv').config();

async function testSmallBatch() {
    console.log('🧪 Testing migration with just 3 products...');
    
    // Source API
    const sourceAPI = axios.create({
        baseURL: process.env.SOURCE_URL,
        auth: {
            username: process.env.SOURCE_CONSUMER_KEY,
            password: process.env.SOURCE_CONSUMER_SECRET
        },
        timeout: 30000
    });
    
    // Target API
    const targetAPI = axios.create({
        baseURL: process.env.TARGET_URL,
        auth: {
            username: process.env.TARGET_CONSUMER_KEY,
            password: process.env.TARGET_CONSUMER_SECRET
        },
        timeout: 30000
    });
    
    try {
        // Fetch just 3 products
        console.log('📥 Fetching 3 products from source...');
        const response = await sourceAPI.get('/wp-json/wc/v3/products?per_page=3');
        const products = response.data;
        
        console.log(`Found ${products.length} products:`);
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
        });
        
        // Try to create them one by one
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(`\n🔄 Processing: ${product.name}`);
            
            // Clean product data
            const cleanProduct = {
                name: product.name,
                type: 'simple',
                status: 'draft',
                description: product.description || '',
                short_description: product.short_description || '',
                regular_price: product.regular_price || '',
                images: product.images ? product.images.filter(img => img.src).map(img => ({
                    src: img.src,
                    name: img.name || '',
                    alt: img.alt || product.name
                })) : []
            };
            
            // Only add SKU if it exists
            if (product.sku && product.sku.trim()) {
                cleanProduct.sku = product.sku.trim() + '-test';
            }
            
            try {
                const result = await targetAPI.post('/wp-json/wc/v3/products', cleanProduct);
                console.log(`✅ Successfully created: ${result.data.name} (ID: ${result.data.id})`);
                
                // Delete it immediately to avoid clutter
                await targetAPI.delete(`/wp-json/wc/v3/products/${result.data.id}?force=true`);
                console.log(`🗑️  Cleaned up test product`);
                
            } catch (error) {
                console.log(`❌ Failed: ${error.response?.data?.message || error.message}`);
            }
            
            // Wait between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n🎉 Test completed! If products were created successfully, your setup is working.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testSmallBatch();