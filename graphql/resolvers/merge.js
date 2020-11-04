const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date')
const DataLoader = require('dataloader');

const eventLoader = new DataLoader((eventIds)=>{
    return events(eventIds);
});

const userLoader = new DataLoader((userIds)=>{
    return  User.find({_id: {$in: userIds}});
})

const transformBooking = booking => {
    return {
        ...booking._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    }
}
const transformEvent = event => {
    return {
        ...event._doc,
        _id:event.id, 
        creator: user.bind(this, event.creator),
        date: new Date(event._doc.date).toISOString(),
    }
}

const events = eventIds =>{
    return Event.find({_id:{$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return transformEvent(event);
        })
    })
    .catch(err=>{
        throw err;
    });
}

const singleEvent = async eventId => {
    try{
        const event = await eventLoader.load(eventId.toString());
        return event;
    }
    catch (err){
        throw err;
    }
}

const user = (userId) =>{
    return userLoader.load(userId.toString())
    .then(user => {
        return {
            ...user._doc, 
            _id:user.id, 
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
    })
    .catch(err=>{
        throw err;
    })
}

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;