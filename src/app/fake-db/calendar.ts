import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';

export class CalendarFakeDb
{

    public static data = [
        {
            id  : 'events',
            data: [
                {
                    start    : subDays(startOfDay(new Date()), 1),
                    end      : addDays(new Date(), 1),
                    title    : '3 giorni di evento',
                    allDay   : true,
                    color    : {
                        primary  : '#F44336',
                        secondary: '#FFCDD2'
                    },
                    resizable: {
                        beforeStart: true,
                        afterEnd   : true
                    },
                    draggable: true,
                    meta     : {
                        location: 'Napoli',
                        notes   : 'Note Test'
                    }
                },
                {
                    start    : startOfDay(new Date()),
                    title    : 'Evento senza data di fine',
                    allDay   : false,
                    color    : {
                        primary  : '#FF9800',
                        secondary: '#FFE0B2'
                    },
                    resizable: {
                        beforeStart: true,
                        afterEnd   : true
                    },
                    draggable: true,
                    meta     : {
                        location: 'Napoli',
                        notes   : 'Note Test'
                    }
                },
                {
                    start    : subDays(endOfMonth(new Date()), 3),
                    end      : addDays(endOfMonth(new Date()), 3),
                    title    : 'Un evento lungo a cavallo di 2 mesi',
                    allDay   : false,
                    color    : {
                        primary  : '#1E90FF',
                        secondary: '#D1E8FF'
                    },
                    resizable: {
                        beforeStart: true,
                        afterEnd   : true
                    },
                    draggable: true,
                    meta     : {
                        location: 'Napoli',
                        notes   : 'Note Test'
                    }
                },
                {
                    start    : addHours(startOfDay(new Date()), 2),
                    end      : new Date(),
                    title    : 'Evento trascinabile e ridimensionabile',
                    allDay   : false,
                    color    : {
                        primary  : '#673AB7',
                        secondary: '#D1C4E9'
                    },
                    resizable: {
                        beforeStart: true,
                        afterEnd   : true
                    },
                    draggable: true,
                    meta     : {
                        location: 'Napoli',
                        notes   : 'Note Test'
                    }
                }
            ]
        }
    ];
}
