import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [header, setHeader] = useState("Choose template");
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState();

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await axios.get("https://api.imgflip.com/get_memes");
      const memes = data.data.memes.filter((meme, index) => index < 9);

      setTemplates(memes);
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (template) {
      setHeader("Insert text");
    }
  }, [template]);

  const renderContent = () => {
    //waiting for templates to load
    if (templates.length === 0) {
      return <p>Loading...</p>;
    }

    //show templates if none selected
    else if (templates.length > 0 && !template) {
      const content = templates.map((el, index) => {
        return (
          <img
            className="template"
            src={el.url}
            alt={el.name}
            key={index}
            onClick={() => setTemplate(el)}
          ></img>
        );
      });

      return <div className="templates">{content}</div>;
    }
  };

  return (
    <React.Fragment>
      <h1>{header}</h1>
      {renderContent()}
    </React.Fragment>
  );
};

export default App;
