import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Percent } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  isSubsidized: boolean;
  subsidyPercentage: number;
  imageUrl?: string;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  unit,
  category,
  isSubsidized,
  subsidyPercentage,
  imageUrl,
}: ProductCardProps) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem?.quantity || 0;
  
  const finalPrice = isSubsidized ? price * (1 - subsidyPercentage / 100) : price;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id,
      name,
      price,
      unit,
      isSubsidized,
      subsidyPercentage,
    });
    setTimeout(() => setIsAdding(false), 300);
  };

  const categoryColors: Record<string, string> = {
    seeds: "bg-success/10 text-success",
    fertilizers: "bg-primary/10 text-primary",
    pesticides: "bg-destructive/10 text-destructive",
    equipment: "bg-accent/20 text-accent-foreground",
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft card-hover">
      {/* Image */}
      <div className="relative h-40 bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={categoryColors[category] || "bg-muted"}>
            {category}
          </Badge>
        </div>
        
        {isSubsidized && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              <Percent className="w-3 h-3 mr-1" />
              {subsidyPercentage}% Off
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-primary">₹{finalPrice.toFixed(0)}</span>
          <span className="text-sm text-muted-foreground">/{unit}</span>
          {isSubsidized && (
            <span className="text-sm text-muted-foreground line-through">₹{price}</span>
          )}
        </div>

        {/* Actions */}
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => updateQuantity(id, quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="flex-1 text-center font-semibold">{quantity} {unit}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => updateQuantity(id, quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="hero"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
