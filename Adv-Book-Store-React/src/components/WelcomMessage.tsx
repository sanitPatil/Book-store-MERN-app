import Welcome from "/welcom.jpeg";
const WelcomeMessage = () => {
  const messageStyle = {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  };

  const imageStyle = {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "10px",
    margin: "20px 0",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "400px",
    margin: "0 auto",
  };

  return (
    <div style={containerStyle}>
      <img src={Welcome} alt="Welcome to Book World" style={imageStyle} />
      <h1 style={messageStyle}>Welcome to Book World!</h1>
      <p
        style={{ textAlign: "center", fontSize: "18px", color: "#555" }}
        className="italic"
      >
        Discover a treasure trove of stories, knowledge, and inspiration. Browse
        our collection to find your next great read!
      </p>
    </div>
  );
};

export default WelcomeMessage;
