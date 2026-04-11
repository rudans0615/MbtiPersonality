import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  productUrl: string;
  imageUrl: string;
  price: number;
}

interface CoupangRecommendProps {
  keyword: string;
  title?: string;
}

export function CoupangRecommend({ keyword, title }: CoupangRecommendProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Using our proxy endpoint
        const response = await fetch(`/api/affiliates/coupang?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        
        // Coupang API format parsing
        if (data && data.rCode === "0" && data.data && Array.isArray(data.data.productData)) {
          const mappedProducts = data.data.productData.slice(0, 4).map((p: any) => ({
            id: p.productId,
            name: p.productName,
            productUrl: p.productUrl,
            imageUrl: p.productImage,
            price: p.productPrice
          }));
          setProducts(mappedProducts);
        } else if (data.products && Array.isArray(data.products)) {
          // Fallback if data is already formatted
          setProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error("Coupang fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-center flex flex-col items-center justify-center">
        <i className="fas fa-spinner fa-spin text-3xl text-primary mb-3"></i>
        <p className="text-sm text-neutral-500">당신을 위한 맞춤 추천 상품을 찾고 있습니다...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show anything if no products found
  }

  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-2xl p-6 mb-8 border border-neutral-200 relative overflow-hidden shadow-inner">
      <div className="absolute -top-4 -right-4 p-2 opacity-5">
        <i className="fas fa-shopping-bag text-8xl"></i>
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center relative z-10">
        <i className="fas fa-gift mr-2 text-red-500"></i>
        {title || `"${keyword}" 유형을 위한 찰떡 추천템`}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-neutral-700 line-clamp-2 mb-2 h-8 font-medium leading-tight">{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-bold text-sm">{product.price.toLocaleString()}원</span>
                <span className="bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">로켓</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-neutral-400 mt-4 text-right">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
