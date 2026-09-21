document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    // 1. Tambahkan state modal di sini
    itemDetailModal: false,
    itemDetail: {},

    // 2. Tambahkan fungsi untuk menampilkan detail produk
    showDetail(item) {
      this.itemDetail = item;
      this.itemDetailModal = true;
    },

    // 3. Array items milik Anda (tetap sama)
    items: [
      {
        id: 1,
        name: "ID Card Lembaran/ID Card Panitia",
        img: "1.jpg",
        price: 18000,
      },
      { id: 2, name: "ID Card T-14", img: "2.jpg", price: 25000 },
      { id: 3, name: "Pulpen Kapcat GelPen", img: "3.jpg", price: 36000 },
      { id: 4, name: "Kalkulator Rezdo KK837b", img: "4.jpg", price: 38000 },
      { id: 5, name: "Notebook A6", img: "5.jpg", price: 12500 },
      { id: 6, name: "ID Card Plastik DX", img: "6.jpg", price: 25000 },
      { id: 7, name: "Set Alat Tulis Anak", img: "7.jpg", price: 25000 },
      { id: 8, name: "Yoyo ID Card", img: "8.jpg", price: 150000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return items;
          }
        });
      }
      console.log(this.items);
    },
    remove(id) {
      // Cari item yang akan dihapus/dikurangi
      const cartItem = this.items.find((item) => item.id === id);

      if (!cartItem) return;

      if (cartItem.quantity > 1) {
        // Jika quantity > 1, kurangi quantity dan recalculate total
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika quantity = 1, hapus item dari array items
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
function sendToWhatsApp(name, email, phone) {
  // Ambil item dari Alpine Store
  const items = Alpine.store("cart").items;
  const total = Alpine.store("cart").total;

  // Format rincian produk
  let productList = items
    .map(
      (item) =>
        `- ${item.name} (${item.quantity}x) = Rp ${item.total.toLocaleString("id-ID")}`,
    )
    .join("\n");

  // Format teks pesan
  const message =
    `Halo, saya ingin melakukan pemesanan ATK:\n\n` +
    `*Data Pemesan:*\n` +
    `Nama: ${name}\n` +
    `Email: ${email}\n` +
    `No. HP: ${phone}\n\n` +
    `*Rincian Pesanan:*\n` +
    `${productList}\n\n` +
    `*Total Bayar:* Rp ${total.toLocaleString("id-ID")}\n\n` +
    `Mohon info rekening/QRIS untuk pembayaran via e-wallet (GoPay/Dana/OVO). Terima kasih!`;

  // Encode URL dan buka WhatsApp
  const whatsappUrl = `https://wa.me/628815651785?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}
