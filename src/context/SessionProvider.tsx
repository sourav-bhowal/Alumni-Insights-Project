"use client";
import { Session, User } from "lucia";
import { createContext, useContext } from "react";

// TYPE OF SESSION
interface SessionContext {
  user: User;
  session: Session;
}

// CREATE SESSION CONTEXT
const SessionContext = createContext<SessionContext | null>(null);

// CREATE SESSION PROVIDER
export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// ERROR OR NULL HANDLING IF NO SESSION
export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("UseSession must be used within a SessionProvider");
  }

  return context;
}
