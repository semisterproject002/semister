import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const CartSheet = () => {
  const { items, totalItems, totalAmount, subsidizedAmount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/dashboard/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add products to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map((item) => {
                const finalPrice = item.isSubsidized
                  ? item.price * (1 - item.subsidyPercentage / 100)
                  : item.price;
                const itemTotal = finalPrice * item.quantity;

                return (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-semibold text-primary">₹{finalPrice.toFixed(0)}</span>
                        <span className="text-xs text-muted-foreground">/{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="flex-1" />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">₹{itemTotal.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <SheetFooter className="flex-col gap-4 border-t border-border pt-4">
              {subsidizedAmount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Subsidy Savings</span>
                  <span>-₹{subsidizedAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </div>
              <Button variant="hero" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
