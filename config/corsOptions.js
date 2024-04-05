const corsOptions = {
  origin: "http://localhost:3000",
  // //  credentials ===> bach server yasta9bal ay cookies min requests
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;