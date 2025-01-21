/* eslint-disable react/prop-types */

import CustomBackArrow from "./CustomBackArrow";
import CustomFilter from "./CustomFilter";

export default function CustomLayoutHeader({
  title,
  subtitle,
  backArrow,
  onClick,

  filters = [],
}) {
  return (
    <div className="flex flex-row gap-10 justify-start items-center w-full">
      {backArrow && (
        <div onClick={onClick}>
          <CustomBackArrow className="text-GENERAL_BLUE cursor-pointer" />
        </div>
      )}
      <div className="flex flex-col gap-1 justify-start items-start">
        <div className="font-semibold text-2xl text-GENERAL_BLUE">{title}</div>
        <div className="text-sm">{subtitle}</div>
      </div>
      {filters.length > 0 && <CustomFilter filters={filters} />}
    </div>
  );
}
