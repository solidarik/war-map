let MapObject = require('../models/mapObjectsModel');

exports.get = async function(ctx, next) {

        MapObject.remove({}, async (err) => {
            if (!err)
                ctx.body = 'database cleared';

                //TODO
        });
   // }

  };
