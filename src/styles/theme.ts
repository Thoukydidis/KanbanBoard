import { createMuiTheme } from "@material-ui/core/styles";

// @ts-ignore
export default createMuiTheme({
  palette: {},
  overrides: {
    MuiInputBase: {
      input: { background: "#fff" },
      multiline: { background: "#fff" },
    },
    MuiSelect: {
      outlined: {
        paddingTop: 10.5,
        paddingBottom: 10.5,
      },
    },
  },
  props: {
    MuiDialog: {
      transitionDuration: 0.5,
    },
    MuiPopover: {
      PaperProps: { square: true },
    },
    MuiTextField: {
      variant: "outlined",
      margin: "dense",
      InputLabelProps: {
        shrink: true,
      },
    },
  },
});
