import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons/faArrowCircleDown";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowCircleUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";

interface Props {
  label: string;
  percentage: number | null;
  selected?: boolean;
  inverted?: boolean;
  onClick: () => void;
}

export function Arrow({
  inverted,
  percentage,
  classes,
}: Pick<Props, "inverted" | "percentage"> & { classes?: string }) {
  const upColor = inverted ? "text-red-600" : "text-green-600";
  const downColor = inverted ? "text-green-600" : "text-red-600";

  if (percentage == null || percentage === 0)
    return (
      <FontAwesomeIcon
        icon={faArrowCircleRight}
        className={cn("size-5", "text-gray-600", classes)}
      />
    );

  return percentage > 0 ? (
    <FontAwesomeIcon
      icon={faArrowCircleUp}
      className={cn("size-5", upColor, classes)}
    />
  ) : (
    <FontAwesomeIcon
      icon={faArrowCircleDown}
      className={cn("size-5", downColor, classes)}
    />
  );
}

export function IndicatorCard({
  label,
  percentage,
  selected,
  inverted,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between space-y-1 rounded-md border p-3 min-w-fit min-h-[72px] cursor-pointer hover:shadow",
        selected ? "border-gray-500 bg-gray-100" : "border-gray-200 bg-white"
      )}
      onClick={onClick}
    >
      <span className="text-xs font-semibold text-gray-900 text-nowrap min-w-[calc(128px-24px)]">
        {label}
      </span>
      <div className="flex flex-row justify-between">
        <span className="text-xl text-gray-900">
          {Number((percentage ?? 0) / 100).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
        </span>
        <Arrow
          inverted={inverted}
          percentage={percentage}
          classes="self-center"
        />
      </div>
    </div>
  );
}
