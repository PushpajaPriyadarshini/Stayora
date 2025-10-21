const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pushpajapriyadarshini:Waziy3e39Y1vdsup@cluster0.vvr4ezy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));
