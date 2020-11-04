const Event = require('../../models/event');
const Booking = require('../../models/booking');
const {transformEvent, transformBooking} = require('./merge')

module.exports = {

    bookings: async(args, req)=>{
        console.log('fetch booking hit')
        if(!req.isAuth){
            throw new Error('Not Authenticated');
        }
        try{
            const bookings = await Booking.find({user: req.userId})
            console.log(bookings)
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        }catch(err){
            throw err;
        }
    },
    
    bookEvent: async (args,req) =>{
        // console.log(req.isAuth);
        // console.log(args.eventId);
        if(!req.isAuth){
            throw new Error('Not Authenticated');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        console.log(fetchedEvent)
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent,
        })
        const result = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event =transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        }
        catch(err){
            throw err;
        }
    }

}