import {
  ArrowUpRight,
  Clock,
  Coffee,
  Mail,
  MapPin,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import { UseCart } from "../Context/CartContext";

export const Footer = ({
  onNavigateHome,
  onOpenMenu,
  onOpenStory,
  onOpenHistory,
}) => {
  const { OpenCart } = UseCart();

  return (
    <footer className="site-footer" id="kunjungi">
      <div className="container footer-grid">
        <div className="footer-brand">
          <button type="button" className="brand" onClick={onNavigateHome}>
            <span className="brand-mark">
              <Coffee size={22} />
            </span>
            <span className="brand-copy">
              <strong>Titik Seduh.</strong>
              <small>Arsip racikan Nusantara</small>
            </span>
          </button>
          <p>
            Kedai kecil untuk kopi yang dicatat dengan rapi dan diminum tanpa
            terburu-buru.
          </p>
          <div className="footer-social">
            <a href="mailto:halo@titikseduh.id">
              <Mail size={16} />
              halo@titikseduh.id
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Jelajahi</h3>
          <button type="button" onClick={onNavigateHome}>
            Beranda <ArrowUpRight size={13} />
          </button>
          <button type="button" onClick={onOpenMenu}>
            Arsip racikan <ArrowUpRight size={13} />
          </button>
          <button type="button" onClick={onOpenStory}>
            Cerita kami <ArrowUpRight size={13} />
          </button>
          <button type="button" onClick={OpenCart}>
            Keranjang <ShoppingBag size={13} />
          </button>
          <button type="button" onClick={onOpenHistory}>
            Riwayat pesanan <Receipt size={13} />
          </button>
        </div>

        <div className="footer-column">
          <h3>Kunjungi</h3>
          <p>
            <MapPin size={15} />
            Jl. Cikini Raya No. 26
            <br />
            Jakarta Pusat
          </p>
          <p>
            <Clock size={15} />
            Senin–Jumat · 08.00–21.00
            <br />
            Sabtu–Minggu · 09.00–22.00
          </p>
        </div>

        <div className="footer-note">
          <p className="eyebrow">{"// pesan dari dapur"}</p>
          <h3>Datang untuk kopi, tinggal untuk cerita.</h3>
          <p>
            Meja kami selalu punya kursi kosong. Bawa pertanyaan, buku, atau
            teman yang belum pernah mencoba manual brew.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Pangeran Valerensco</span>
        <span>Dibuat untuk UTS React Fundamental 2026</span>
      </div>
    </footer>
  );
};
