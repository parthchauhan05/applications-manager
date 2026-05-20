import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gmailService } from "../services/gmailService";

const ActiveAccountContext = createContext(null);

export function ActiveAccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAccounts = async () => {
      try {
        const res = await gmailService.getAccounts();
        const list = Array.isArray(res?.data) ? res.data : [];

        if (!mounted) return;

        setAccounts(list);
        setActiveAccount((prev) => recomputeActiveFromList(list, prev));
      } catch {
        if (!mounted) return;
        setAccounts([]);
        setActiveAccount(null);
      } finally {
        if (mounted) setLoadingAccounts(false);
      }
    };

    loadAccounts();

    return () => {
      mounted = false;
    };
  }, []);
    const reloadAccounts = async () => {
        const res = await gmailService.getAccounts();
        const list = Array.isArray(res?.data) ? res.data : [];
        setAccounts(list);
        setActiveAccount((prev) => {
            if (prev && list.some((a) => a.email === prev)) return prev;
            return list.length > 0 ? list[0].email : null;
        });
    };

  const value = useMemo(
    () => ({
      accounts,
      activeAccount,
      setActiveAccount,
          loadingAccounts,
      reloadAccounts
    }),
    [accounts, activeAccount, loadingAccounts]
  );
    
    const recomputeActiveFromList = (list, currentActive) => {
        if (!list || list.length === 0) return null;
        if (currentActive && list.some((a) => a.email === currentActive)) {
            return currentActive;
        }
        return list[0].email;
    };


  return (
    <ActiveAccountContext.Provider value={value}>
      {children}
    </ActiveAccountContext.Provider>
  );
}

export function useActiveAccount() {
  const ctx = useContext(ActiveAccountContext);
  if (!ctx) {
    throw new Error("useActiveAccount must be used within ActiveAccountProvider");
  }
  return ctx;
}

