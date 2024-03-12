const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

async function checkOverlappingReservations(carId, startDate, endDate) {
    return await Reservation.exists({
        car: carId,
        $or: [
            { startDate: { $lte: endDate, $gte: startDate } },
            { endDate: { $lte: endDate, $gte: startDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
    });
}

async function updateCarAvailability(carId, isAvailable) {
    const car = await Car.findById(carId);
    if (car) {
        car.isAvailable = isAvailable;
        await car.save();
    }
}

// CREATE
const createReservation = async (req, res) => {
    try {
        const { user, car, startDate, endDate } = req.body;
        if (await checkOverlappingReservations(car, startDate, endDate)) {
            return res.status(400).send('Car is already reserved for the requested period.');
        }
        const reservation = new Reservation({ user, car, startDate, endDate });
        await reservation.save();
        await updateCarAvailability(car, false);
        res.status(201).send(reservation);
    } catch (error) {
        res.status(400).send(error);
    }
};

// UPDATE
const updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) {
            return res.status(404).send();
        }
        await updateCarAvailability(reservation.car, true);
        res.send(reservation);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE
const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).send();
        }
        await updateCarAvailability(reservation.car, true);
        res.send(reservation);
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET
const getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).send();
        }
        res.send(reservation);
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET ALL
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({});
        res.send(reservations);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { createReservation, updateReservation, deleteReservation, getReservation, getReservations };
