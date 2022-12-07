import Box from "@mui/material/Box";
import React from "react";
import Menu from "./components/ui-elements/Menu";

function App() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Menu />
    </Box>
  );
}

export default App;
