import { create } from "zustand";

const store = (set) => ({
    organisationUnits: [],
    setOrganisationUnits: organisationUnits => set({ organisationUnits }),
});

const organisationUnitsStore = create(store);

export default organisationUnitsStore;
