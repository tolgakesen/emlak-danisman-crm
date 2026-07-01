import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { subscribeContacts } from "../services/contacts";
import { subscribeCalls } from "../services/calls";
import { subscribeLeads } from "../services/leads";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [calls, setCalls] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!user) {
      setContacts([]);
      setCalls([]);
      setLeads([]);
      return;
    }
    const unsubContacts = subscribeContacts(user.id, setContacts);
    const unsubCalls = subscribeCalls(user.id, setCalls);
    const unsubLeads = subscribeLeads(user.id, setLeads);
    return () => {
      unsubContacts();
      unsubCalls();
      unsubLeads();
    };
  }, [user]);

  function contactById(id) {
    return contacts.find((c) => c.id === id);
  }

  return (
    <DataContext.Provider value={{ contacts, calls, leads, contactById }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
