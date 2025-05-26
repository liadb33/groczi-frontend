const FALLBACK_IMAGE_URL =
  "https://as1.ftcdn.net/v2/jpg/12/19/96/10/1000_F_1219961041_W6S8bKS3jeJVOKM5vCJPNlmmBCCUcdIM.jpg";

export const mapCartResponseToCartItems = (data: any): CartItemType[] => {
  return data.items.map((item: any) => {
    const quantity = item.quantity || 1;

    return {
      id: item.cartItemId,
      itemCode: item.itemCode,
      name: item.name || "מוצר ללא שם",
      quantity,
      price: Number(item.subtotal),
      category: "פירות",
      imageUrl: FALLBACK_IMAGE_URL,
    };
  });
};
