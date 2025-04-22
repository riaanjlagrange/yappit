const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/posts";
};

export default logout;
