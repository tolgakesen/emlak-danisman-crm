export const ILGI_TURLERI = [
  { value: "alici", label: "Alıcı" },
  { value: "satici", label: "Satıcı" },
  { value: "kiraci", label: "Kiracı" },
  { value: "ev_sahibi", label: "Ev Sahibi (Kiraya Verecek)" },
  { value: "yatirimci", label: "Yatırımcı" },
];

export const ARAMA_SONUCLARI = [
  { value: "ulasildi", label: "Ulaşıldı, görüşüldü" },
  { value: "mesgul", label: "Meşgul / cevap yok" },
  { value: "acmadi", label: "Açmadı" },
  { value: "geri_aranacak", label: "Geri aranacak" },
  { value: "ilgilenmiyor", label: "İlgilenmiyor" },
];

export const LEAD_DURUMLARI = [
  { value: "yeni", label: "Yeni" },
  { value: "takipte", label: "Takipte" },
  { value: "kazanildi", label: "Kazanıldı" },
  { value: "kaybedildi", label: "Kaybedildi" },
];

export function labelFor(list, value) {
  return list.find((item) => item.value === value)?.label || value;
}
