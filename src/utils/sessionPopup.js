// src/utils/sessionPopup.js
import React from "react";
import { createRoot } from "react-dom/client";
import SessionExpiredModal from "../components/SessionExpiredModal";

// Singleton reference to the modal root
let modalRoot = null;

export const showSessionExpiredModal = (
  message = "Session expired. Please login."
) => {
  if (modalRoot) return; // prevent multiple modals

  const div = document.createElement("div");
  document.body.appendChild(div);
  modalRoot = createRoot(div);

  const handleConfirm = () => {
    modalRoot.unmount();
    document.body.removeChild(div);
    modalRoot = null;

    localStorage.clear();
    window.location.href = "/login";
  };

  modalRoot.render(
    <SessionExpiredModal message={message} onConfirm={handleConfirm} />
  );
};
