import React from "react";
import type { AdminConfig } from "@keystone-6/core/types";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img style={{ height: "42px", width: "42px" }} src="/pub/logo.png" />
      <h4>holewinski.dev</h4>
    </div>
  );
}

export const components: AdminConfig['components'] = { Logo };
