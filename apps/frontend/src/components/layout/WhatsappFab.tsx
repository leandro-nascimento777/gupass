/** Suporte via WhatsApp — botão flutuante fixo (ver referência real, canto inferior direito). */
const WHATSAPP_SUPPORT_URL = 'https://api.whatsapp.com/send?phone=5551981995625'

export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_SUPPORT_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Suporte via WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="size-7 fill-white">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.36A10 10 0 1 0 12 2Zm0 18.2a8.16 8.16 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.14c-.24-.12-1.43-.7-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.24 0-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.4-.55-.4h-.47c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </a>
  )
}
