const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketcontrol = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketcontrol.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    client.emit('estadoActual', {
        actual: ticketcontrol.getUltimoTicket(),
        ultimos4: ticketcontrol.ultimos4
    });

    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es requerido'
            });
        }

        let atenderTicket = ticketcontrol.atenderTicket(data.escritorio);
        callback(atenderTicket);
        // actualizar/notificar cambios en los ultimos4

        client.broadcast.emit('ultimos4', { ultimos4: ticketcontrol.ultimos4 })
    });

});