const Event = require('../../models/event');
const { transformEvent} = require('./merge');
const User = require('../../models/user');

module.exports = {
    events: () => {
        return Event.find()
        .then(events => {
            return events.map(event=>{
                return transformEvent(event);
            });
        })
        .catch(err=>{
            throw err;
        })
    },

    
    createEvent: (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId,
        });
        let createdEvent ;
        return event
            .save()
            .then(res=>{
                createdEvent = transformEvent(res);
                return User.findById("5f9e502fa6d05d065dd8389b");
            })
            .then(user => {
                if(!user){
                    throw new Error('User not found')
                }
                user.createdEvents.push(event)
                return user.save();
            })
            .then(res =>{
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    
    
    

}