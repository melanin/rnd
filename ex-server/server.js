var mongoose = require('mongoose');
mongoose.connect('mongodb://104.155.224.73:80/expass-test');

var Data = mongoose.model('Data', {
    email: String,
    password: String
});

var io = require('socket.io').listen(1337);

console.log('Server running at localhost:1337');

io.sockets.on('connection', function(socket) {

    console.log('client(' + socket.id + ') connect');

    // socket.emit('ping', true);

    socket.on('disconnect', function() {
        console.log('client(' + socket.id + ') disconnect');
        socket.broadcast.emit('close', socket.id);
    });

    socket.on('ReqAdd', function(__data) {
        console.log('::ReqAdd(' + __data + ')');
        Data.create(
            {
                email: __data.email
                , password: __data.password
            }
            , function(__err, __todos)
            {
                if(__err)
                {
                    console.log('[ERR] ReqAdd(' + __err + ')');
                }
                else
                {
                    ResDataList();
                }
            }
        );
    });

    socket.on('ReqDataList', function() {
        console.log('::ReqDataList');
        ResTodoList();
    });

    // socket.on('ReqDeleteList', function(__list) {
    //     if(0 == __list.length)
    //     {
    //         console.log('not delete');
    //         return;
    //     }
    //
    //     // console.log(__list);
    //     // var successCount = 0;
    //     for(var i=0; i<__list.length; i++)
    //     {
    //         // console.log(__list[i]._id);
    //         Data.remove(
    //             { _id: __list[i]._id }
    //             , function(__err, todos) {
    //                 if(__err)
    //                 {
    //                     console.log('[ERR] ReqDeleteList(' + __err + ')');
    //                 }
    //                 else
    //                 {
    //                     // successCount += 1;
    //                     // console.log('count');
    //                 }
    //             }
    //         );
    //     }
    //
    //     // console.log('delete result : ' + __list.length + ', ' + successCount);
    //     // if(__list.length == successCount)
    //     {
    //         ResDataList();
    //         // console.log('call!!!');
    //     }
    // });

    var ResDataList = function()
    {
        Data.find(function(__err, __data) {
            if(__err)
            {
                console.log('[ERR] ResDataList(' + __err + ')');
            }
            else
            {
                // console.log(todos);
                // for(var i=0; i<todos.length; i++)
                // {
                //     console.log(todos[i]);
                // }
                socket.emit('ResDataList', __data);
            }
        });
    }

});
