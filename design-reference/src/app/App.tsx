import { createContext, useContext, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import type { Profile } from "./pillba-data";

type AppContextType = {
  activeProfile: Profile | null;
  login: (profile: Profile) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType>({
  activeProfile: null,
  login: () => {},
  logout: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  return (
    <AppContext.Provider
      value={{
        activeProfile,
        login: (p) => setActiveProfile(p),
        logout: () => setActiveProfile(null),
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
