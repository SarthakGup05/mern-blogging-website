import React, { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";

import Publishform from "../components/Publishform";
import Blogeditor from "../components/Blogeditor";

const BlogStructure = {
  title: "",
  Banner: "",
  content: [],
  tags: [],
  des: '',
  date: new Date(),
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [editorState, SetEditorState] = useState("editor");
  const [blog, setBlog] = useState(BlogStructure);
  const [TextEditor, setTextEditor] = useState({isReady:false});
  const { userAuth } = useContext(UserContext);
  const token = userAuth?.token;

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, SetEditorState,TextEditor, setTextEditor }}>
      {token === null ? (
        <Navigate to="/signin" />
      ) : editorState === "editor" ? (
        <Blogeditor />
      ) : (
        <Publishform />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
