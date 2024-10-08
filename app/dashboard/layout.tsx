import React from "react";

export const metadata = {
  title: "Dashboard",
};

function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default UserLayout;
