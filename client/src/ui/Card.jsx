export default function Card({
  as = "section",
  title,
  titleId,
  children,
  className = "",
}) {
  const Tag = as;
  const hid = titleId || (title ? `card-${Math.random().toString(36).slice(2, 9)}` : undefined);
  return (
    <Tag
      aria-labelledby={title ? hid : undefined}
      className={`bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 ${className}`}
    >
      {title && (
        <h2 id={hid} className="text-lg font-extrabold text-plu-black mb-3">
          {title}
        </h2>
      )}
      {children}
    </Tag>
  );
}
