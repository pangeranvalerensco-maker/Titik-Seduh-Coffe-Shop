import { Coffee, Leaf, MapPin } from "lucide-react";

const Notes = [
  {
    icon: MapPin,
    title: "Alamat rasa",
    text: "Setiap biji datang dari petani yang punya nama dan cerita. Kami mencatatnya di setiap cangkir.",
  },
  {
    icon: Coffee,
    title: "Seduh perlahan",
    text: "Rasio, suhu, dan waktu kami jaga. Bukan karena rumit, tetapi karena rasa memang layak diperhatikan.",
  },
  {
    icon: Leaf,
    title: "Ruang untuk tinggal",
    text: "Meja panjang, cahaya sore, dan playlist pelan. Datang untuk kopi, tinggal untuk percakapan.",
  },
];

export const StorySection = () => {
  return (
    <section className="story-section" id="cerita">
      <div className="container">
        <div className="story-intro">
          <p className="eyebrow">{"// catatan kedai"}</p>
          <h2 className="section-title">
            Bukan sekadar daftar menu.
            <span> Ini arsip rasa.</span>
          </h2>
          <p className="section-text">
            Titik Seduh lahir dari kebiasaan sederhana: mencatat apa yang kami seduh,
            dari mana bijinya, dan bagaimana rasanya berubah. Arsip itu kini
            menjadi menu yang bisa kamu jelajahi.
          </p>
        </div>

        <div className="story-grid">
          {Notes.map(({ icon: Icon, title, text }, index) => (
            <article className="story-card" key={title}>
              <span className="story-number">0{index + 1}</span>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <blockquote className="story-quote">
          “Kami tidak menjual kopi. Kami menyimpan cerita, lalu menuangkannya
          dalam cangkir.”
          <span>— Pangeran Valerensco, pendiri</span>
        </blockquote>
      </div>
    </section>
  );
};
