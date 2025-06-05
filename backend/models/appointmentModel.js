/*const { DataTypes } = require('sequelize'); // zakładam Sequelize, ale może masz inne ORM lub czysty MySQL?

module.exports = (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        visit_code: { type: DataTypes.STRING(50), allowNull: true },
        doctor_id: { type: DataTypes.INTEGER, allowNull: true },
        patient_id: { type: DataTypes.INTEGER, allowNull: true },
        visit_type: { type: DataTypes.STRING(100), allowNull: true },
        payment_method: { type: DataTypes.STRING(100), allowNull: true },
        payment_status: { type: DataTypes.ENUM('paid', 'unpaid'), allowNull: true, defaultValue: 'unpaid' },
        visit_date: { type: DataTypes.DATEONLY, allowNull: true },
        visit_time: { type: DataTypes.TIME, allowNull: true },
        patient_first_name: { type: DataTypes.STRING(100), allowNull: true },
        patient_last_name: { type: DataTypes.STRING(100), allowNull: true },
        patient_email: { type: DataTypes.STRING(150), allowNull: true },
        patient_phone: { type: DataTypes.STRING(50), allowNull: true },
        patient_age: { type: DataTypes.INTEGER, allowNull: true },
        patient_weight: { type: DataTypes.INTEGER, allowNull: true },
        chronic_diseases: { type: DataTypes.TEXT, allowNull: true },
        medications: { type: DataTypes.TEXT, allowNull: true },
        symptoms: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'appointments',
        timestamps: false
    });

    return Appointment;
};*/

const db = require('./db');

async function createAppointment(appointmentData) {
    const [result] = await db.execute(
        `INSERT INTO appointments 
        (visit_code, doctor_id, patient_id, visit_type, payment_method, payment_status, visit_date, visit_time,
        patient_first_name, patient_last_name, patient_email, patient_phone, patient_age, patient_weight,
        chronic_diseases, medications, symptoms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            appointmentData.visit_code,
            appointmentData.doctor_id,
            appointmentData.patient_id,
            appointmentData.visit_type,
            appointmentData.payment_method,
            appointmentData.payment_status,
            appointmentData.visit_date,
            appointmentData.visit_time,
            appointmentData.patient_first_name,
            appointmentData.patient_last_name,
            appointmentData.patient_email,
            appointmentData.patient_phone,
            appointmentData.patient_age,
            appointmentData.patient_weight,
            appointmentData.chronic_diseases,
            appointmentData.medications,
            appointmentData.symptoms
        ]
    );

    return result;
}

module.exports = {
    createAppointment
};
