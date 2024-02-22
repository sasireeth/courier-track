const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 7000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3004');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());
app.use(cors("http://localhost:3000", {credentials: true}));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sasireeth:qoX5te4cvvU3KtOL@sasireeth.yrradyf.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

const JWT_SECRET_KEY = 'your-secret-key';


const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};


const User = require('./model/user');

const Admin = require('./model/admin');

const Tracking = require('./model/tracking');


app.post('/api/user/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (username==="") {
      return res.status(400).json({ error: 'Username is required' });
    }
    else if (password==="") {
      return res.status(400).json({ error: 'Password is required' });
    }
    const existingUser = await User.exists({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this username' });
    }
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
  
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ user: user._id }, JWT_SECRET_KEY);
    console.log({ success: true, token })
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in as user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/admin/tracking', authenticateAdmin, async (req, res) => {
  const { trackingNumber, status, location } = req.body;

  try {
    // Check if the tracking number already exists
    const existingTracking = await Tracking.findOne({ trackingNumber });

    if (existingTracking) {
      return res.status(400).json({ error: 'Tracking number already exists' });
    }

    // If not, create a new tracking entry
    const newTracking = new Tracking({ trackingNumber, status, location });
    await newTracking.save();

    return res.status(200).json({ success: true, message: 'Tracking information added successfully' });
  } catch (error) {
    console.error('Error adding tracking information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/tracking/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  try {
    const trackingInfo = await Tracking.findOne({ trackingNumber });

    if (!trackingInfo) {
      // No tracking information found for the given trackingNumber
      res.status(404).json({ error: 'Tracking information not found' });
    } else {
      // Tracking information found, send it as JSON response
      console.log(trackingInfo);
      return res.status(200).json(trackingInfo);
    }
  } catch (error) {
    console.error('Error retrieving tracking information:', error);
    res.status(500).json({ error: 'Error retrieving tracking information' });
  }
});


app.get('/api/admin/tracking', authenticateAdmin, async (req, res) => {
  try {
    const allTracking = await Tracking.find();
    // console.log(allTracking);
    return res.status(200).json(allTracking);
  } catch (error) {
    console.error('Error retrieving tracking information:', error);
    res.status(500).json({ error: 'Error retrieving tracking information' });
  }
});

app.put('/api/admin/tracking/:trackingNumber', authenticateAdmin, async (req, res) => {
  const { trackingNumber } = req.params;
  const { status, location } = req.body;

  try {
    const updatedTracking = await Tracking.findOneAndUpdate(
      { trackingNumber },
      { $set: { status, location } },
      { new: true }
    );
    console.log(updatedTracking)
    if (!updatedTracking) {
      return res.json({ error: 'Tracking information not found' });
    }

    return res.status(200).json({ success: true, updatedTracking });
  } catch (error) {
    console.log('Error updating tracking information:', error);
    res.status(500).json({ error: 'Error updating tracking information' });
  }
});

app.delete('/api/admin/tracking/:trackingNumber', authenticateAdmin, async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const deletedTracking = await Tracking.findOneAndDelete({ trackingNumber });
    console.log(deletedTracking)

    if (deletedTracking) {
      res.json({ success: true, deletedTracking });
    } else {
      res.status(404).json({ error: 'Tracking information not found' });
    }
  } catch (error) {
    console.error('Error deleting tracking information:', error);
    res.status(500).json({ error: 'Error deleting tracking information' });
  }
});

app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (username==="") {
      return res.status(400).json({ error: 'Username is required' });
    }
    else if (password==="") {
      return res.status(400).json({ error: 'Password is required' });
    }
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with this username' });
    }

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ user: admin._id, isAdmin: true }, JWT_SECRET_KEY);
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in as admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});