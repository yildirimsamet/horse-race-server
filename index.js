const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use('/user', require('./routers/user'));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went wrong",
  });
});

app.listen(PORT, (err) => {
  console.log(`Server is running on port ${PORT}`);
})