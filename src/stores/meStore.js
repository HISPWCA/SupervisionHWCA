import { create } from "zustand";

const store = (set) => ({
    me: null,
    setMe: (me) => set({ me }),
});

const meStore = create(store);

export default meStore;
