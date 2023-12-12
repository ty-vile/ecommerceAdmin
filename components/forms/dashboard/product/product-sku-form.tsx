// shadcn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductSku } from "@prisma/client";

type Props = {
  product: Product | null;
  sku: ProductSku | null;
};

const ProductSkuForm = ({ product, sku }: Props) => {
  return (
    <section className="flex flex-col gap-4">
      <Label>Product SKU</Label>
      <Input
        disabled
        value={sku?.sku}
        className="disabled:text-black disabled:opacity-100"
      />
      <Label>Product Description</Label>
      <Textarea
        disabled
        value={product?.description}
        className="disabled:text-black disabled:opacity-100"
      />
    </section>
  );
};

export default ProductSkuForm;
