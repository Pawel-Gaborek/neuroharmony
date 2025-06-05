const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorAuthRoutes = require('./routes/doctorAuthRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth-doctor', doctorAuthRoutes);
app.use('/api/doctor', doctorRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server działa na porcie ${PORT}`);
});
