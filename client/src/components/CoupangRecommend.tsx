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
        
        // 개발 환경 폴백(에러 시 더미 데이터로 UI 확인)
        if (import.meta.env.DEV) {
          console.warn("개발 환경: 쿠팡 API 호출 실패로 더미 데이터를 렌더링합니다.");
          setProducts([
            { id: 1, name: `[더미] ${keyword} 인기상품 1위`, productUrl: "#", imageUrl: "https://via.placeholder.com/150/FFD1DC/FF9EBB?text=Dummy+Item", price: 15000 },
            { id: 2, name: `[더미] ${keyword} 가성비템`, productUrl: "#", imageUrl: "https://via.placeholder.com/150/E6E6FA/B39EB5?text=Dummy+Item", price: 22000 },
            { id: 3, name: `[더미] ${keyword} 베스트 셀러`, productUrl: "#", imageUrl: "https://via.placeholder.com/150/FFF0F5/FFB6C1?text=Dummy+Item", price: 9900 },
            { id: 4, name: `[더미] ${keyword} 로켓배송`, productUrl: "#", imageUrl: "https://via.placeholder.com/150/E0FFFF/87CEFA?text=Dummy+Item", price: 35000 }
          ]);
        }
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
      <div className="bg-pink-50/50 backdrop-blur-sm rounded-3xl p-6 mb-8 text-center flex flex-col items-center justify-center border border-pink-100/50">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-pink-500 font-medium tracking-wide">당신을 위한 찰떡 추천템을 찾는 중...✨</p>
      </div>
    );
  }

  if (products.length === 0) {
    if (import.meta.env.DEV) {
      return (
        <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-2xl p-6 mb-8 text-center text-neutral-500 text-sm">
          [개발 환경] "{keyword}" 에 대한 쿠팡 상품 검색 결과가 0건이거나 API 연동 오류 발생. <br />
          (.env 쿠팡 API 키를 확인하세요. 실제 상용망에서는 이 영역이 렌더링되지 않습니다.)
        </div>
      );
    }
    return null; // Don't show anything if no products found in production
  }

  return (
    <div className="bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-indigo-50/80 backdrop-blur-xl rounded-[2rem] p-6 mb-8 border border-white/60 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] transform rotate-12 pointer-events-none">
        <i className="fas fa-gift text-[120px]"></i>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 opacity-50"></div>
      
      <h3 className="text-xl font-bold text-neutral-800 mb-5 flex items-center relative z-10 tracking-tight">
        <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          {title || `"${keyword}" 유형을 위한 찰떡 추천템 🎀`}
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white group"
          >
            <div className="aspect-square flex items-center justify-center overflow-hidden border-b border-pink-50/50 bg-white/40 p-2">
              <img 
                src={`/api/affiliates/image?url=${encodeURIComponent(product.imageUrl)}`} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-500 rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="p-3.5">
              <p className="text-[0.8rem] text-neutral-700 line-clamp-2 mb-2.5 h-8 font-medium leading-relaxed group-hover:text-pink-600 transition-colors">{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-pink-500 font-bold text-[0.95rem] tracking-tight">{product.price.toLocaleString()}원</span>
                <span className="bg-pink-100/80 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm border border-pink-200/50">로켓</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-neutral-400 mt-5 text-center font-medium bg-white/30 py-1.5 rounded-lg border border-white/40">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
