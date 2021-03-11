import mongoose from 'mongoose';

mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    },
)

mongoose.connection.on('open', () => {
  console.log("Connected to MongoDB...")
})