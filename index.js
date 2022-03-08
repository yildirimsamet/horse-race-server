const express = require('express');
const app = express();
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

app.listen(5000, (err) => {
  console.log('Server is running on port 5000');
})