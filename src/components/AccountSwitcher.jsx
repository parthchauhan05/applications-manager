import { Dropdown } from "primereact/dropdown";
import { useActiveAccount } from "../context/ActiveAccountContext";

export default function AccountSwitcher() {
  const { accounts, activeAccount, setActiveAccount, loadingAccounts } = useActiveAccount();

  if (loadingAccounts || accounts.length === 0) return null;

  if (accounts.length === 1) {
    return (
      <div className="db-account-switcher db-account-switcher--single">
        <i className="pi pi-envelope" />
        <span>{accounts[0].email}</span>
      </div>
    );
  }

  const options = accounts.map((account) => ({
    label: account.email,
    value: account.email,
  }));

  return (
    <div className="db-account-switcher">
      <Dropdown
        value={activeAccount}
        options={options}
        onChange={(e) => setActiveAccount(e.value)}
        placeholder="Select email"
        className="db-account-switcher__dropdown"
      />
    </div>
  );
}