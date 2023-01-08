export default async function(ctx, next) {
    console.log('render page events');
    ctx.body = ctx.render('page-events');
};
