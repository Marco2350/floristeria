import { WishlistClient } from "./wishlist-client";

export const metadata = {
  title: "Favoritos · Lirios",
  description: "Tus flores y arreglos guardados para después.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
