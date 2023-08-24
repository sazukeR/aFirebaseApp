import React from "react";
import { JournalLayout } from "../layout/JournalLayout";
import { NoteView, NothingSelectedView } from "../views";
import { IconButton } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { startNewNote } from "../../store/journal";
// CON <TypoGraphy /> SE UTILIZA LA FUENTE DE NUESTRO THEME

export const JournalPage = () => {
  const { isSaving, active } = useSelector((state) => state.journal);

  const dispatch = useDispatch();

  const onClickNewNote = () => {
 
    dispatch(startNewNote());
  };

  return (
    <>
      <JournalLayout>
        {/*         <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet et
          magnam obcaecati odit error ipsam quae recusandae tenetur repellat
          atque.
        
        </Typography> */}
        {!!active ? <NoteView /> : <NothingSelectedView />}

        {/*  <NothingSelectedView /> */}
        {/*  <NoteView /> */}
        <IconButton
          onClick={onClickNewNote}
          disabled={isSaving}
          size="large"
          sx={{
            color: "white",
            backgroundColor: "error.main",
            ":hover": { backgroundColor: "error.main", opacity: 0.8 },
            position: "fixed",
            bottom: 50,
            right: 50,
          }}
        >
          <AddOutlined sx={{ fontSize: 30 }} />
        </IconButton>
      </JournalLayout>
    </>
  );
};
