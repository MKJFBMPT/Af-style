import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Components & SEO
import ProductCard from '../../components/product/ProductCard';
import SEO from '../../components/common/SEO'; // এসইও ইঞ্জিন ইমপোর্ট

// Data & Stores
import { mockProducts } from '../../data/mockProducts';
import type { Product } from '../../data/mockProducts';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useLanguageStore from '../../store/useLanguageStore';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setIsLoading(true);
      try {
        let currentProduct: Product | null = null;
        
        // ১. মেইন প্রোডাক্ট খুঁজে বের করা
        const foundInMock = mockProducts.find((p) => p.id === id);
        if (foundInMock) {
          currentProduct = foundInMock;
        } else if (id) {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            currentProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          }
        }

        if (currentProduct) {
          setProduct(currentProduct);
          if (currentProduct.colors?.length > 0) setSelectedColor(currentProduct.colors[0]);

          // ২. সংশ্লিষ্ট পণ্যসমূহ (Related Products) খোঁজা
          const q = query(
            collection(db, 'products'), 
            where('category', '==', currentProduct.category), 
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const firebaseRelated: Product[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== currentProduct?.id) {
              firebaseRelated.push({ id: doc.id, ...doc.data() } as Product);
            }
          });

          const mockRelated = mockProducts.filter(p => p.category === currentProduct?.category && p.id !== currentProduct.id);
          const mergedRelated = [...firebaseRelated, ...mockRelated].slice(0, 4);
          setRelatedProducts(mergedRelated);
        } else {
          navigate('/shop');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchProductAndRelated();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size.'); return; }
    if (!product) return;

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });
    toast.success(`${product.name} added to your collection.`);
  };

  const isFavourite = product ? isInWishlist(product.id) : false;

  if (isLoading || !product) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* --- DYNAMIC SEO FOR PRODUCT --- */}
      <SEO 
        title={product.name}
        description={`Buy ${product.name} for ৳${Number(product.price).toLocaleString()} at AF STYLE. ${product.description.substring(0, 100)}...`}
        image={product.images[0]}
        type="product"
      />

      <div className="luxury-container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-luxury-platinum mb-12">
          <Link to="/" className="hover:text-luxury-charcoal transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-luxury-charcoal transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-luxury-charcoal font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 w-full md:w-20">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[3/4] w-full border transition-all duration-500 overflow-hidden ${
                    selectedImage === index ? 'border-brand-gold' : 'border-luxury-platinum/20'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="flex-1 relative aspect-[3/4] bg-luxury-platinum overflow-hidden group shadow-sm">
              <img 
                src={product.images[selectedImage] || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b border-luxury-platinum/20 pb-8 mb-8">
              <p className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4 font-bold">{product.category}</p>
              <h1 className="text-3xl md:text-5xl font-serif italic mb-6 leading-tight text-luxury-charcoal">{product.name}</h1>
              <p className="text-2xl font-bold tracking-widest text-brand-dark mb-6 uppercase">
                ৳{Number(product.price).toLocaleString()}
              </p>
              <p className="text-sm font-light leading-relaxed text-luxury-charcoal/70 tracking-wide">
                {product.description}
              </p>
            </div>

            <div className="space-y-10">
              {/* Variant Selections */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-4 text-luxury-charcoal">Select Color: <span className="font-light opacity-50 ml-2">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-4">
                  {product.colors?.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 text-[10px] tracking-widest border transition-all uppercase ${selectedColor === color ? 'border-brand-gold bg-brand-gold/5 font-bold text-brand-dark' : 'border-luxury-platinum/40 text-luxury-charcoal/70 hover:border-luxury-charcoal'}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-luxury-charcoal mb-4">Select Size</p>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes?.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`py-3 text-[10px] font-bold tracking-widest border transition-all duration-300 uppercase ${selectedSize === size ? 'bg-brand-dark text-white border-brand-dark shadow-xl' : 'border-luxury-platinum/40 text-luxury-charcoal hover:border-luxury-charcoal'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-luxury-platinum/40">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-brand-gold transition-colors text-luxury-charcoal"><Minus size={14} /></button>
                    <span className="w-10 text-center text-xs font-bold text-luxury-charcoal">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-brand-gold transition-colors text-luxury-charcoal"><Plus size={14} /></button>
                  </div>
                  
                  <button onClick={handleAddToCart} className="flex-1 btn-premium flex items-center justify-center gap-4 group shadow-xl">
                    <ShoppingBag size={16} /> Add to Collection
                  </button>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleWishlist(product)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-4 border text-[9px] tracking-[0.2em] uppercase font-bold transition-all ${isFavourite ? 'border-brand-gold bg-brand-gold/5 text-brand-dark' : 'border-luxury-platinum/40 hover:bg-gray-50'}`}
                  >
                    <Heart size={14} fill={isFavourite ? "currentColor" : "none"} /> {isFavourite ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button onClick={() => {navigator.clipboard.writeText(window.location.href); toast.success('Link Copied');}} className="flex-1 flex items-center justify-center gap-2 py-4 border border-luxury-platinum/40 text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 transition-colors">
                    <Share2 size={14} /> Share Piece
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-luxury-platinum/20 pt-20">
            <h2 className="text-3xl font-serif italic text-luxury-charcoal mb-12">You May Also Excellence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedProducts.map((relatedProd) => (
                <ProductCard key={relatedProd.id} product={relatedProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;