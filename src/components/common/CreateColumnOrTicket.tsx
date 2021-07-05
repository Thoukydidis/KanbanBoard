import { useState } from "react";
import { Button, makeStyles, TextField, Tooltip } from "@material-ui/core";
import { inputValueSetter } from "./functions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
interface Props {
  buttonName: string;
  onAdd: (value: string) => void;
}

function CreateColumnOrTask(props: Props) {
  const [columnBoardName, setColumnBoardName] = useState<string>("");
  const [isEditing, setEditing] = useState(false);
  const classes = useStyles();

  const onOK = () => {
    if (columnBoardName !== "") {
      props.onAdd && props.onAdd(columnBoardName);
      setEditing(false);
      setColumnBoardName("");
    }
  };

  return (
    <div className={classes.container}>
      {isEditing ? (
        <>
          <TextField
            autoFocus
            value={columnBoardName}
            fullWidth
            onChange={inputValueSetter(setColumnBoardName)}
            onBlur={(e) => {
              !!e?.target?.value ? onOK() : setEditing(false);
            }}
            placeholder={props.buttonName}
          />
        </>
      ) : (
        <Button>
          <Tooltip title={props.buttonName}>
            <ControlPointIcon
              onClick={() => setEditing(true)}
              fontSize="large"
              className={classes.addIcon}
            />
          </Tooltip>
        </Button>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  addIcon: {
    alignSelf: "center",
  },
  container: {
    display: "flex",
    marginTop: 12,
    justifyContent: "center",
  },
});

export default CreateColumnOrTask;
