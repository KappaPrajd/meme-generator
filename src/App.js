import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [header, setHeader] = useState("Choose template");
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState();
  const [upperText, setUpperText] = useState("");
  const [lowerText, setLowerText] = useState("");
  const [result, setResult] = useState();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!upperText && !lowerText) {
      alert("Fill out the form!");
      return;
    }

    const { data } = await axios.post(
      "https://api.imgflip.com/caption_image",
      null,
      {
        params: {
          template_id: template.id,
          text0: upperText,
          text1: lowerText,
          username: "KappaPrajd",
          password: "BasicPassword",
        },
      }
    );

    setResult(data.data);
    setHeader("Download meme");
  };

  const handleClick = () => {
    setTemplate();
    setResult();
    setHeader("Choose template");
    setUpperText("");
    setLowerText("");
  };

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
      //show form to generate meme
    } else if (template && !result) {
      return (
        <React.Fragment>
          <img
            className="selected"
            src={template.url}
            alt={template.name}
          ></img>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Upper text</label>
            <input
              type="text"
              value={upperText}
              onChange={(e) => setUpperText(e.target.value)}
            ></input>
            <label>Lower text</label>
            <input
              type="text"
              value={lowerText}
              onChange={(e) => setLowerText(e.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img className="result" src={result.url} alt={template.name}></img>
          <button className="flush" onClick={handleClick}>
            Try again
          </button>
        </React.Fragment>
      );
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
