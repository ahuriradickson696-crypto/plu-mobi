export default function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  as = "section",
}) {
  const Tag = as;
  return (
    <Tag
      aria-label={title}
      className="text-center bg-white border border-plu-black/10 rounded-2xl p-8 md:p-10"
    >
      <h3 className="text-lg font-extrabold text-plu-black mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-plu-slate max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Tag>
  );
}
