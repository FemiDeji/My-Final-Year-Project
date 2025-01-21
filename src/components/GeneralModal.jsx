/* eslint-disable react/prop-types */

import { IoClose } from "react-icons/io5";
import "./css/modal.css";

function GeneralModal({
  isOpen,
  onClose,
  children,
  showCloseButton,
  transparent = false,
  zIndex = 100000,
  widthClass = "w-1/2",
  height = "auto",
}) {
  return (
    <div
      className="custom-modal"
      style={{ display: isOpen ? "" : "none", zIndex }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={`${widthClass} mx-auto text-center relative`}>
        {showCloseButton && (
          <IoClose
            style={{
              position: "absolute",
              top: ".9em",
              right: "14%",
              fontSize: "1.3em",
              color: "red",
              cursor: "pointer",
              zIndex: 100001,
            }}
            onClick={onClose}
          />
        )}
        <div
          className={`${
            transparent ? "" : "bg-white"
          } w-3/4 rounded-lg p-5 mx-auto`}
          style={{ height: height, overflowY: "auto" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default GeneralModal;
