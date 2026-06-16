import { createContext, useContext, useState } from "react";

const UiContext = createContext();

export function UiProvider({ children }) {
  const [modalNovoAgendamento, setModalNovoAgendamento] =
    useState(false);

  return (
    <UiContext.Provider
      value={{
        modalNovoAgendamento,
        setModalNovoAgendamento,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  return useContext(UiContext);
}