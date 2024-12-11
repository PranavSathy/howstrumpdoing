interface Props {
  title: string;
  subtext: string;
}

export function LegislationCard({ title, subtext }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex flex-col lg:max-w-64 space-y-1">
      <p className="body-s text-gray-900 line-clamp-3">{title}</p>
      <p className="font-semibold text-xs text-gray-500">{subtext}</p>
    </div>
  );
}
