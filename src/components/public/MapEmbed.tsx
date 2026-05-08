export function MapEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="rounded-[12px] overflow-hidden border border-[#e2e8f0] h-48">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
