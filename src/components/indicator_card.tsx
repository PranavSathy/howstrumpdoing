import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons/faArrowCircleDown";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowCircleUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";

interface Props {
  label: string;
  percentage: number;
  selected?: boolean;
}

export function IndicatorCard({ label, percentage, selected }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between space-y-1 rounded-md border p-3 min-w-[128px] min-h-[72px] cursor-pointer hover:shadow",
        selected ? "border-gray-500 bg-gray-100" : "border-gray-200 bg-white"
      )}
    >
      <span className="text-xs font-semibold text-gray-900">{label}</span>
      <div className="flex flex-row justify-between">
        <span className="text-xl text-gray-900">
          {Number(percentage / 100).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
        </span>
        {percentage > 0 ? (
          <FontAwesomeIcon
            icon={faArrowCircleUp}
            className="text-green-600 size-5 self-center"
          />
        ) : (
          <FontAwesomeIcon
            icon={faArrowCircleDown}
            className="text-red-600 size-5 self-center"
          />
        )}
      </div>
    </div>
  );
}
