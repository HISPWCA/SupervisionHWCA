import { create } from "zustand";

const store = (set) => ({
    users: [],
    setUsers: users => set({ users }),
});

const usersStore = create(store);

export default usersStore;
